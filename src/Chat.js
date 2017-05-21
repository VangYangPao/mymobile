import uuid from "uuid";
import React, { Component } from "react";
import {
  DatePickerAndroid,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Button
} from "react-native";
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
import ImagePicker from "react-native-image-picker";
import { template } from "lodash";

import PlanCarousel from "./PlanCarousel";
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
const CUSTOMER_USER = {
  _id: CUSTOMER_USER_ID
};
function transposePolicyChoiceByTitle() {
  let policyDict = {};
  POLICIES.forEach(policy => {
    policyDict[policy.title] = policy;
  });
  return policyDict;
}

export default function ChatScreenWrapper(questionSet) {
  const wrapper = props => {
    const routeParams = props.navigation.state.params;
    const isStartScreen = !routeParams && !questionSet;
    let policy;
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

  let drawerLabel;
  let drawerIcon;
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

class ActionButton extends Component {
  render() {
    return (
      <View style={widgetStyles.actionButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            if (this.props.onPress) this.props.onPress();
          }}
          activeOpacity={0.5}
        >
          <View style={widgetStyles.actionButton}>
            <Text style={widgetStyles.actionButtonText}>{this.props.text}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

class ImagePickerActionButton extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
    this.options = {
      title: "Select picture of NRIC",
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };
  }

  handlePress() {
    ImagePicker.showImagePicker(this.options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        if (typeof this.props.onPickImage === "function") {
          this.props.onPickImage(response.uri);
        }
      }
    });
  }

  render() {
    return <ActionButton onPress={this.handlePress} text="SELECT IMAGE" />;
  }
}

class DatePickerActionButton extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
  }

  async handlePress() {
    try {
      const today = new Date();
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: today,
        minDate: today,
        mode: "spinner"
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        const date = new Date(year, month, day);
        if (typeof this.props.onPickDate === "function")
          this.props.onPickDate(date);
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  }

  render() {
    return <ActionButton onPress={this.handlePress} text="SELECT DATE" />;
  }
}

class CoverageDurationWidget extends Component {
  constructor(props) {
    super(props);
    this.coverageDurations = [1, 2, 3, 6, 12];
    this.state = {
      months: this.coverageDurations[0]
    };
  }

  render() {
    const elements = this.coverageDurations.map(d => ({
      label: d + "m",
      value: d
    }));
    const { months } = this.state;
    const s = months > 1 ? "s" : "";
    const totalPremium = (this.props.monthlyPremium * months).toFixed(2);
    const buttonText = `CHOOSE ${months + ""} month${s} - $${totalPremium}`;
    return (
      <View style={widgetStyles.durationContainer}>
        <RangeSlider
          elements={elements}
          onValueChange={months => this.setState({ months })}
          containerStyle={{
            marginBottom: 20
          }}
        />
        <Button
          onPress={() => {
            if (!this.props.onSelectDuration) return;
            this.props.onSelectDuration(this.state.months);
          }}
          disabled={this.props.disabled}
          title={buttonText}
          color={colors.primaryOrange}
          style={widgetStyles.confirmButton}
        />
      </View>
    );
  }
}

const widgetStyles = StyleSheet.create({
  actionButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "white"
  },
  actionButton: {
    height: 44,
    alignItems: "center",
    justifyContent: "center"
  },
  actionButtonContainer: {
    flex: 1,
    backgroundColor: colors.primaryOrange,
    height: 44
  },
  confirmButton: {
    marginTop: 20,
    marginBottom: 30
  },
  durationContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 17,
    marginBottom: 22,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
    borderRadius: 3,
    backgroundColor: "white",
    elevation: 4
  }
});

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      answering: true,
      renderInput: true,
      currentQuestionIndex: -1,
      answers: { policy: props.policy }
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
    this.handleSelectPolicy = this.handleSelectPolicy.bind(this);
    this.handleSelectPlan = this.handleSelectPlan.bind(this);
    this.handleSelectDuration = this.handleSelectDuration.bind(this);
    this.handlePickImage = this.handlePickImage.bind(this);
    this.handlePickDate = this.handlePickDate.bind(this);
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

  handleSelectPolicy(policyTitle) {
    const policy = transposePolicyChoiceByTitle()[policyTitle];
    const params = { policy, page: "info" };
    this.props.navigation.navigate("Policy", params);
  }

  handleSelectPlan(planIndex) {
    const planAlphabet = ["A", "B", "C", "D", "E"];
    const premium = this.props.policy.plans[planIndex].premium;
    this.setState(
      this.concatMessage({
        type: "text",
        _id: uuid.v4(),
        text: `Plan ${planAlphabet[planIndex]} $${premium + ""}/month`,
        value: planIndex,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handleSelectDuration(months) {
    const currentQuestion = this.questions[this.state.currentQuestionIndex];
    if (currentQuestion.id !== "coverageDuration") return;
    const s = months > 1 ? "s" : "";
    this.setState(
      this.concatMessage({
        type: "text",
        _id: uuid.v4(),
        text: `I want to be covered for ${months} month${s}`,
        value: months,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handlePickDate(date) {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    this.setState(
      this.concatMessage({
        type: "text",
        _id: uuid.v4(),
        user: CUSTOMER_USER,
        value: date,
        text: `It happened on ${day}/${month}/${year}.`
      }),
      () => this.setState({ answering: false })
    );
  }

  handlePickImage(imageUri) {
    this.setState(
      this.concatMessage({
        type: "text",
        _id: uuid.v4(),
        user: CUSTOMER_USER,
        value: imageUri,
        image: imageUri
      }),
      () => this.setState({ answering: false })
    );
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
          // this.props.navigation.navigate("Policy", params);
          let form = Object.assign({}, this.state.answers);
          const { planIndex } = form;
          delete form.policy;
          delete form.planIndex;
          delete form.icImage;
          form.totalPremium =
            this.props.policy.plans[planIndex].premium * form.coverageDuration;
          this.props.navigation.navigate("Confirmation", { form });
        }
      }, 2000);
      return;
    }
    const nextQuestion = template(
      this.questions[currentQuestionIndex].question
    )(this.state.answers);
    this.sendNewMessage(nextQuestion);

    this.setState(
      {
        currentQuestionIndex,
        answering: true
      },
      () => {
        const currentQuestion = this.questions[this.state.currentQuestionIndex];
        if (currentQuestion.responseType === null) {
          this.askNextQuestion();
          return;
        }
        const widgets = ["planIndex", "coverageDuration"];
        if (widgets.indexOf(currentQuestion.id) !== -1) {
          this.setState(
            this.concatMessage({
              type: currentQuestion.id,
              _id: uuid.v4(),
              user: AGENT_USER
            }),
            () => this.setState({ renderInput: false })
          );
        }
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("answering", this.state.answering);
    // console.log("renderInput", this.state.renderInput);
    if (
      prevState.answering !== this.state.answering ||
      prevState.renderInput !== this.state.renderInput
    ) {
      // console.log(this.refs.chat._messageContainerRef);
      this.refs.chat.resetInputToolbar();
    }

    if (this.state.answering !== prevState.answering && !this.state.answering) {
      const { messages, currentQuestionIndex } = this.state;

      // skip validation for bootstrap step-0
      if (messages.length === 0) {
        this.askNextQuestion();
      } else {
        const lastMessage = messages[messages.length - 1];
        const lastQuestion = this.questions[currentQuestionIndex];
        // just respond with next question if it's not a question
        if (lastQuestion.responseType === null) {
          this.askNextQuestion();
        }
        let answer = lastMessage.value !== undefined
          ? lastMessage.value
          : lastMessage.text.trim();
        if (
          lastQuestion.responseType.indexOf("number") !== -1 &&
          !isNaN(answer) &&
          typeof answer === "string"
        ) {
          answer = parseFloat(answer);
        }
        const result = validateAnswer(lastQuestion, answer);

        if (result.isValid) {
          let newAnswer = {};
          newAnswer[lastQuestion.id] = lastMessage.value !== undefined
            ? lastMessage.value
            : lastMessage.text;
          const answers = Object.assign(this.state.answers, newAnswer);
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
        return <PolicyChoice onSelectPolicy={this.handleSelectPolicy} />;
      case "planIndex":
        return (
          <PlanCarousel
            onSelectPlan={this.handleSelectPlan}
            plans={this.props.policy.plans}
          />
        );
      case "coverageDuration":
        const notCurrentQuestion =
          this.questions[this.state.currentQuestionIndex].id !==
          "coverageDuration";
        const { planIndex } = this.state.answers;
        return (
          <CoverageDurationWidget
            onSelectDuration={this.handleSelectDuration}
            monthlyPremium={this.props.policy.plans[planIndex].premium}
            disabled={notCurrentQuestion}
          />
        );
      default:
        return <Message {...props} />;
    }
  }

  renderInputToolbar(props) {
    if (this.props.isStartScreen) return null;
    const { currentQuestionIndex } = this.state;
    const question = this.questions[currentQuestionIndex];
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
    if (currentQuestionIndex < 0) return;
    let { responseType } = this.questions[currentQuestionIndex];
    responseType = [].concat(responseType);

    if (responseType.indexOf("image") !== -1) {
      return <ImagePickerActionButton onPickImage={this.handlePickImage} />;
    } else if (responseType.indexOf("date") !== -1) {
      return <DatePickerActionButton onPickDate={this.handlePickDate} />;
    }

    let keyboardType = "default";
    if (responseType.indexOf("email") !== -1) keyboardType = "email-address";
    if (responseType.indexOf("number") !== -1) keyboardType = "numeric";
    if (responseType.indexOf("phoneNumber") !== -1) keyboardType = "phone-pad";
    let textInputProps = { keyboardType };
    return (
      <Composer
        placeholder="Type your message here..."
        {...props}
        textInputProps={textInputProps}
      />
    );
  }

  renderSend(props) {
    return <Send {...props} textStyle={styles.sendButton} />;
  }

  render() {
    const additionalProps = {};
    let minInputToolbarHeight = 44;
    if (
      !this.state.answering ||
      !this.state.renderInput ||
      this.props.isStartScreen
    ) {
      minInputToolbarHeight = 0;
    }
    return (
      <View style={styles.container}>
        <GiftedChat
          ref="chat"
          messages={this.state.messages}
          onSend={this.handleUserSend}
          user={CUSTOMER_USER}
          onLongPress={() => {}}
          renderTime={() => {}}
          renderDay={() => {}}
          renderBubble={this.renderBubble}
          renderMessage={this.renderMessage}
          renderMessageText={this.renderMessageText}
          renderSend={this.renderSend}
          renderComposer={this.renderComposer}
          minInputToolbarHeight={minInputToolbarHeight}
          listViewProps={{
            onContentSizeChange: (contentWidth, contentHeight) => {
              if (this._messageContainerRef === null) {
                return;
              }
              this.refs.chat._messageContainerRef.scrollTo({
                y: contentHeight,
                animated: true
              });
            }
          }}
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
