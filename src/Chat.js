import React, { Component } from "react";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import {
  GiftedChat,
  Message,
  Bubble,
  MessageText
} from "react-native-gifted-chat";
import Icon from "react-native-vector-icons/MaterialIcons";

import colors from "./colors";

const IMAGE_URL = "https://www.drive.ai/images/team/Carol.png";

class StartBanner extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.startBanner}>
        <Image source={{ uri: IMAGE_URL }} style={styles.assistantImage} />
        <Text style={styles.assistantName}>Carol</Text>
        <Text style={styles.assistantPosition}>
          Personal Insurance Assistant
        </Text>
      </View>
    );
  }
}

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.onSend = this.onSend.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderMessageText = this.renderMessageText.bind(this);
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          type: "text",
          _id: 2,
          text: "Hi I'm Carol, please choose the insurance plan you're interested in. 😄",
          createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
          user: {
            _id: 2,
            name: "React Native",
            avatar: IMAGE_URL
          }
        },
        {
          type: "start",
          _id: 1,
          user: {
            _id: 1
          }
        }
      ]
    });
  }

  onSend(messages = []) {
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, messages)
      };
    });
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: StyleSheet.flatten(styles.bubble)
        }}
      />
    );
  }

  renderMessageText(props) {
    return (
      <MessageText
        {...props}
        textStyle={{
          left: StyleSheet.flatten(styles.messageText)
        }}
      />
    );
  }

  renderMessage(props) {
    const { currentMessage } = props;
    switch (currentMessage.type) {
      case "text":
        return <Message {...props} />;
      case "start":
        return <StartBanner />;
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

const imageDim = 150;

const styles = StyleSheet.create({
  startBanner: {
    flex: 1,
    alignItems: "center",
    marginBottom: 20
  },
  assistantImage: {
    height: imageDim,
    width: imageDim,
    borderRadius: imageDim / 2,
    marginBottom: 10
  },
  assistantName: {
    fontWeight: "600",
    fontSize: 20
  },
  assistantPosition: {
    fontSize: 15
  },
  bubble: {
    backgroundColor: colors.primaryOrange
  },
  messageText: {
    color: "white"
  },
  container: {
    flex: 1
  }
});
