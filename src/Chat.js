import uuid from "uuid";
import React, { Component } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  GiftedChat,
  Message,
  Bubble,
  MessageText,
  InputToolbar,
  Composer,
  Send
} from "react-native-gifted-chat";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import Spinner from "react-native-spinkit";
import Sound from "react-native-sound";
import Slider from "react-native-slider";
import { template } from "lodash";

import { Text } from "./defaultComponents";
import RangeSlider from "./RangeSlider";
import PolicyChoice from "./PolicyChoice";
import colors from "./colors";
import POLICIES from "../data/policies";
import { validateAnswer, QUESTION_SETS } from "../data/questions";

// Enable playback in silence mode (iOS only)
Sound.setCategory("Playback");

const FIRST_MSG_LOAD_TIME = 500;
const POLICIES_FADE_IN_TIME = 400;

const AGENT_USER_ID = 0;
const CUSTOMER_USER_ID = 1;

const AGENT_USER = {
  _id: AGENT_USER_ID,
  name: "Carol",
  avatar: require("../images/mom.png")
};
function transposePolicyChoiceByTitle() {
  var policyDict = {};
  POLICIES.forEach(policy => {
    policyDict[policy.title] = policy;
  });
  return policyDict;
}

export default function ChatScreenWrapper(questionSet) {
  const wrapper = props => {
    const routeParams = props.navigation.state.params;
    const isStartScreen = !routeParams && !questionSet;
    var policy;
    if (routeParams) {
      questionSet = questionSet || routeParams.questionSet;
      policy = routeParams.policy;
    }
    return (
      <ChatScreen
        isStartScreen={isStartScreen}
        questionSet={questionSet}
        policy={policy}
        {...props}
      />
    );
  };

  var drawerLabel;
  var drawerIcon;
  if (!questionSet) {
    drawerLabel = "Buy Policies";
    drawerIcon = "message";
  } else if (questionSet === "claim") {
    drawerLabel = "Claim Policies";
    drawerIcon = "attach-money";
  }
  wrapper.navigationOptions = ({ screenProps }) => ({
    title: "microAssure",
    headerTitleStyle: {
      fontWeight: "300"
    },
    drawerLabel,
    drawerIcon: ({ tintColor }) => (
      <Icon name={drawerIcon} size={22} color={tintColor} />
    )
  });
  return wrapper;
}

const BAR_WIDTH = 300;
const BAR_HEIGHT_PERCENT = 0.045;
const SLOT_RADIUS_PERCENT = 0.075;
const SLIDER_RADIUS_PERCENT = 0.15;

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      answering: true,
      currentQuestionIndex: -1,
      answers: {}
    };

    if (props.questionSet) {
      this.questions = QUESTION_SETS[props.questionSet];
    }

    this.renderMessage = this.renderMessage.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderMessageText = this.renderMessageText.bind(this);
    this.renderInputToolbar = this.renderInputToolbar.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.renderSend = this.renderSend.bind(this);

    this.handleUserSend = this.handleUserSend.bind(this);
    this.handleAgentSend = this.handleAgentSend.bind(this);
    this.handleSelectPlan = this.handleSelectPlan.bind(this);
    this.renderStartScreenMessages = this.renderStartScreenMessages.bind(this);
    this.askNextQuestion = this.askNextQuestion.bind(this);
    this.reaskQuestion = this.reaskQuestion.bind(this);
    this.sendNewMessage = this.sendNewMessage.bind(this);

    this.concatMessage = message => {
      return prevState => {
        return { messages: prevState.messages.concat(message) };
      };
    };

    this.newMessageSound = new Sound(
      "incoming.mp3",
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log("failed to load the sound", error);
          return;
        }
        this.newMessageSound.setVolume(0.75);
      }
    );

    this.playNewMessageSound = () => {
      this.newMessageSound.play(success => {
        if (success) {
        } else {
        }
      });
    };
  }

  renderStartScreenMessages() {
    this.setState({
      messages: [
        {
          type: "loading",
          _id: 0,
          text: "loading",
          createdAt: new Date(),
          user: AGENT_USER
        }
      ]
    });

    const renderPolicyChoice = () => {
      this.handleAgentSend({ type: "policies", _id: 1, user: AGENT_USER });
    };

    setTimeout(() => {
      this.setState(
        prevState => {
          return {
            messages: [
              {
                type: "text",
                _id: 0,
                text: "Hi I'm Carol, please choose the insurance policy you're interested in. 😄",
                createdAt: new Date(),
                user: AGENT_USER
              }
            ]
          };
        },
        () => setTimeout(renderPolicyChoice, POLICIES_FADE_IN_TIME)
      );
    }, FIRST_MSG_LOAD_TIME);
  }

  handleUserSend(messages) {
    this.setState(this.concatMessage(messages), () => {
      this.setState({ answering: false });
    });
  }

  handleAgentSend(message) {
    this.setState(this.concatMessage(message), this.playNewMessageSound);
  }

  handleSelectPlan(policyTitle) {
    const policy = transposePolicyChoiceByTitle()[policyTitle];
    const params = { policy, page: "info" };
    this.props.navigation.navigate("Plan", params);
  }

  componentDidMount() {
    if (this.props.isStartScreen) {
      this.renderStartScreenMessages();
    } else {
      // trigger the initial componentDidUpdate
      this.setState({ answering: false });
    }
  }

  sendNewMessage(msgText) {
    this.handleAgentSend({
      _id: uuid.v4(),
      type: "text",
      text: msgText,
      createdAt: new Date(),
      user: AGENT_USER
    });
  }

  reaskQuestion(errMessage) {
    this.sendNewMessage(errMessage);
    this.setState({ answering: true });
  }

  askNextQuestion() {
    const currentQuestionIndex = this.state.currentQuestionIndex + 1;
    if (currentQuestionIndex >= this.questions.length) {
      const { questionSet, policy } = this.props;
      setTimeout(() => {
        if (questionSet === "buy") {
          const params = { policy, page: "checkout" };
          this.props.navigation.navigate("Plan", params);
        }
      }, 500);
      return;
    }
    const nextQuestion = template(
      this.questions[currentQuestionIndex].question
    )(this.state.answers);
    this.sendNewMessage(nextQuestion);
    this.setState({
      currentQuestionIndex,
      answering: true
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.answering !== prevState.answering && !this.state.answering) {
      const { messages, currentQuestionIndex } = this.state;

      // skip validation for bootstrap step-0
      if (messages.length === 0) {
        this.askNextQuestion();
      } else {
        const lastMessage = messages[messages.length - 1];
        const lastQuestion = this.questions[currentQuestionIndex];
        const result = validateAnswer(lastQuestion, lastMessage.text.trim());

        if (result.isValid) {
          var answers = JSON.parse(JSON.stringify(this.state.answers));
          answers[lastQuestion.id] = lastMessage.text;
          this.setState({ answers }, this.askNextQuestion);
        } else {
          this.reaskQuestion(result.errMessage);
          return;
        }
      }
    }
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: StyleSheet.flatten(styles.bubbleLeft),
          right: StyleSheet.flatten(styles.bubbleRight)
        }}
      />
    );
  }

  renderMessageText(props) {
    if (props.currentMessage.type === "loading") {
      return (
        <Spinner style={styles.spinner} color="white" type="ThreeBounce" />
      );
    }
    return (
      <MessageText
        {...props}
        textStyle={{
          left: StyleSheet.flatten(styles.messageTextLeft),
          right: StyleSheet.flatten(styles.messageTextRight)
        }}
        linkStyle={{
          left: StyleSheet.flatten(styles.messageTextLeft),
          right: StyleSheet.flatten(styles.messageTextRight)
        }}
      />
    );
  }

  renderMessage(props) {
    const { currentMessage } = props;
    switch (currentMessage.type) {
      case "text":
        return <Message {...props} />;
      case "policies":
        return <PolicyChoice onSelectPlan={this.handleSelectPlan} />;
      default:
        return <Message {...props} />;
    }
  }

  renderInputToolbar(props) {
    if (this.props.isStartScreen) return null;
    return (
      <InputToolbar
        {...props}
        containerStyle={
          !this.state.answering
            ? { backgroundColor: colors.softBorderLine }
            : null
        }
      />
    );
  }

  renderComposer(props) {
    const { currentQuestionIndex } = this.state;
    const { responseType } = this.questions[currentQuestionIndex];
    // if (responseType !== "datetime") {
    var additionalProps = {};
    if (!this.state.answering) {
      additionalProps = {
        placeholder: "Type your message here...",
        textInputProps: { editable: false }
      };
    }
    return (
      <Composer
        placeholder="Type your message here..."
        {...props}
        {...additionalProps}
      />
    );
    // }
    // return (
    //   <View style={styles.datetimeContainer}>
    //     <TouchableOpacity onPress={() => {}}>
    //       <View style={styles.datetimeInput}>
    //         <Text>Select Date</Text>
    //       </View>
    //     </TouchableOpacity>
    //   </View>
    // );
  }

  renderSend(props) {
    return <Send {...props} textStyle={styles.sendButton} />;
  }

  render() {
    const elements = [
      { label: "10k", value: 10000 },
      { label: "20k", value: 20000 },
      { label: "50k", value: 50000 },
      { label: "100k", value: 100000 }
    ];
    const additionalProps = {};
    if (!this.state.answering || this.props.isStartScreen) {
      additionalProps.minInputToolbarHeight = 0;
    }
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.handleUserSend}
          user={{
            _id: CUSTOMER_USER_ID
          }}
          onLongPress={() => {}}
          renderTime={() => {}}
          renderDay={() => {}}
          renderBubble={this.renderBubble}
          renderMessage={this.renderMessage}
          renderMessageText={this.renderMessageText}
          renderInputToolbar={this.renderInputToolbar}
          renderComposer={this.renderComposer}
          renderSend={this.renderSend}
          {...additionalProps}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  datetimeInput: {},
  datetimeContainer: {
    flex: 1
  },
  textInput: {
    backgroundColor: colors.softBorderLine
  },
  sendButton: {
    color: colors.primaryOrange
  },
  bubbleLeft: {
    backgroundColor: colors.primaryOrange
  },
  messageTextLeft: {
    textDecorationLine: "none",
    color: "white"
  },
  bubbleRight: {
    backgroundColor: "white"
  },
  messageTextRight: {
    textDecorationLine: "none",
    color: colors.primaryText
  },
  spinner: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10
  },
  container: {
    flex: 1,
    paddingTop: 12
  }
});
