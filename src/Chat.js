import React, { Component } from "react";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
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
import Spinner from "react-native-spinkit";
import Sound from "react-native-sound";

import Plans from "./Plans";
import colors from "./colors";
import PLANS from "../data/plans";

// Enable playback in silence mode (iOS only)
Sound.setCategory("Playback");

const IMAGE_URL = "https://www.drive.ai/images/team/Carol.png";
const FIRST_MSG_LOAD_TIME = 500;
const PLANS_FADE_IN_TIME = 200;

const AGENT_USER_ID = 0;
const CUSTOMER_USER_ID = 1;

const AGENT_USER = {
  _id: AGENT_USER_ID,
  name: "Carol",
  avatar: IMAGE_URL
};
function transposePlansByTitle() {
  var planDict = {};
  PLANS.forEach(plan => {
    planDict[plan.title] = plan;
  });
  return planDict;
}

export default function ChatScreenWrapper(questionSet) {
  const wrapper = props => {
    const isQuestions = !!props.navigation.state.params;
    isStartScreen = !isQuestions;
    return (
      <ChatScreen
        isStartScreen={isStartScreen}
        questionSet={questionSet}
        {...props}
      />
    );
  };
  wrapper.navigationOptions = ({ screenProps }) => ({
    title: "microAssure",
    drawerLabel: "Buy Policies",
    drawerIcon: ({ tintColor }) => (
      <Icon name="message" size={22} color={tintColor} />
    )
  });
  return wrapper;
}

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      answering: false,
      currentQuestionIndex: 0
    };

    this.handleSend = this.handleSend.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderMessageText = this.renderMessageText.bind(this);
    this.renderInputToolbar = this.renderInputToolbar.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.renderSend = this.renderSend.bind(this);

    this.handleSelectPlan = this.handleSelectPlan.bind(this);
    this.incomingPopSound = new Sound(
      "incoming.mp3",
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log("failed to load the sound", error);
          return;
        }
        this.incomingPopSound.setVolume(0.75);
      }
    );
  }

  componentDidMount() {
    if (this.props.isStartScreen) {
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

      const renderPlans = () => {
        this.setState(
          prevState => {
            const messages = prevState.messages.concat([
              { type: "plans", _id: 1, user: AGENT_USER }
            ]);
            return { messages };
          },
          () => {
            this.incomingPopSound.play(success => {
              if (success) {
              } else {
              }
            });
          }
        );
      };

      setTimeout(() => {
        this.setState(
          prevState => {
            return {
              messages: [
                {
                  type: "text",
                  _id: 0,
                  text: "Hi I'm Carol, please choose the insurance plan you're interested in. 😄",
                  createdAt: new Date(),
                  user: AGENT_USER
                }
              ]
            };
          },
          () => setTimeout(renderPlans, PLANS_FADE_IN_TIME)
        );
      }, FIRST_MSG_LOAD_TIME);
    } else {
      // this.setState({});
    }
  }

  handleSend(messages = []) {
    this.setState(prevState => {
      return {
        messages: prevState.messages.concat(messages)
      };
    });
  }

  handleSelectPlan(planTitle) {
    const plan = transposePlansByTitle()[planTitle];
    this.props.navigation.navigate("Plan", plan);
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
      />
    );
  }

  renderMessage(props) {
    const { currentMessage } = props;
    switch (currentMessage.type) {
      case "text":
        return <Message {...props} />;
      case "plans":
        return <Plans onSelectPlan={this.handleSelectPlan} />;
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
    if (!this.state.answering) {
      return <Composer {...props} textInputProps={{ editable: false }} />;
    }
    return <Composer {...props} />;
  }

  renderSend(props) {
    return <Send {...props} textStyle={styles.sendButton} />;
  }

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.handleSend}
          user={{
            _id: 1
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
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    color: "white"
  },
  bubbleRight: {
    backgroundColor: "white"
  },
  messageTextRight: {
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
