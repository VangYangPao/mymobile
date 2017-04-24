import React, { Component } from "react";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import {
  GiftedChat,
  Message,
  Bubble,
  MessageText
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

function transposePlansByTitle() {
  var planDict = {};
  PLANS.forEach(plan => {
    planDict[plan.title] = plan;
  });
  return planDict;
}

export default class ChatScreen extends Component {
  static navigationOptions = {
    title: "microAssure",
    headerTitleStyle: {
      fontFamily: "Courgette"
    },
    drawerLabel: "Buy Policies",
    drawerIcon: ({ tintColor }) => (
      <Icon name="message" size={22} color={tintColor} />
    )
  };

  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.onSend = this.onSend.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderMessageText = this.renderMessageText.bind(this);
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

  componentWillUpdate(nextProps, nextState) {
    const { messages } = nextState;
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage.user._id === 2 &&
      (lastMessage.type === "text" || lastMessage.type === "plans")
    ) {
      this.incomingPopSound.play(success => {
        if (success) {
        } else {
        }
      });
    }
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          type: "loading",
          _id: 1,
          text: "loading",
          createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
          user: {
            _id: 2,
            name: "Carol",
            avatar: IMAGE_URL
          }
        }
      ]
    });

    const renderPlans = () => {
      this.setState(prevState => {
        const messages = prevState.messages.concat([
          { type: "plans", _id: 2, user: { _id: 2 } }
        ]);
        return { messages };
      });
    };

    setTimeout(() => {
      this.setState(prevState => {
        setTimeout(renderPlans, PLANS_FADE_IN_TIME);
        return {
          messages: [
            {
              type: "text",
              _id: 1,
              text: "Hi I'm Carol, please choose the insurance plan you're interested in. 😄",
              createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
              user: {
                _id: 2,
                name: "Carol",
                avatar: IMAGE_URL
              }
            }
          ]
        };
      });
    }, FIRST_MSG_LOAD_TIME);
  }

  onSend(messages = []) {
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

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          user={{
            _id: 1
          }}
          onLongPress={() => {}}
          renderTime={() => {}}
          renderDay={() => {}}
          renderBubble={this.renderBubble}
          renderMessage={this.renderMessage}
          renderMessageText={this.renderMessageText}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
