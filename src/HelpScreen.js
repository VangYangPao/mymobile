import React, { Component } from "react";
import uuidv4 from "uuid/v4";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import {
  GiftedChat,
  Send,
  Composer,
  Message,
  MessageText,
  Bubble,
  Time
} from "react-native-gifted-chat";
import { StackNavigator } from "react-navigation";
import { Text } from "./defaultComponents";
import Page from "./Page";
import { backButtonNavOptions } from "./navigations";
import colors from "./colors";
import CHAT_STYLES from "./Chat.styles";

const AGENT_USER_ID = 0;
const CUSTOMER_USER_ID = 1;

const AGENT_USER = {
  _id: AGENT_USER_ID,
  name: "Eve",
  avatar: require("../images/eve.jpg")
};
const CUSTOMER_USER = {
  _id: CUSTOMER_USER_ID
};

class HelpScreen extends Component {
  static navigationOptions = {
    title: "Help",
    drawerLabel: () => null
  };

  constructor(props) {
    super(props);
    this.state = { messages: [], composerText: "" };
    this.handleUserSend = this.handleUserSend.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
  }

  componentDidMount() {}

  handleUserSend(message) {
    const sendOfflineMessage = () => {
      this.setState({
        messages: this.state.messages.concat({
          type: "text",
          _id: uuidv4(),
          text:
            "Sorry, none of our customer service representatives are online. We will get back to you shortly.",
          value: true,
          user: AGENT_USER
        })
      });
    };
    this.setState({ messages: this.state.messages.concat(message) }, () => {
      setTimeout(sendOfflineMessage, 2000);
    });
  }

  renderSend(props) {
    return <Send {...props} textStyle={styles.sendButton} />;
  }

  renderComposer(props) {
    const handleTextChanged = text => {
      this.setState({ composerText: text }, () => props.onTextChanged(text));
    };
    return (
      <Composer
        text={this.state.composerText}
        onTextChanged={handleTextChanged}
        placeholder="Type your question here..."
        {...props}
      />
    );
  }

  renderFooter(props) {
    if (props.messages.length > 0) return null;
    return (
      <View style={styles.footerContainer}>
        <Image
          style={styles.agentImage}
          source={require("../images/eve.png")}
        />
        <Text style={styles.agentName}>EVE</Text>
        <Text style={styles.agentPosition}>Customer Support</Text>
        <Text style={styles.instructions}>
          To begin, type in your question below. We will try to match you with
          questions in our database!
        </Text>
      </View>
    );
  }

  renderTime(props) {
    return (
      <Time
        textStyle={{
          left: StyleSheet.flatten(styles.messageTextLeft),
          right: StyleSheet.flatten(styles.messageTextRight)
        }}
        {...props}
      />
    );
  }

  renderMessage(props) {
    const messageContainerStyle = {
      left: {
        alignItems: "flex-start"
      },
      right: {
        alignItems: "flex-start"
      }
    };
    return <Message {...props} containerStyle={messageContainerStyle} />;
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

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          onLongPress={() => {}}
          renderTime={this.renderTime}
          renderDay={() => {}}
          messages={this.state.messages}
          onSend={this.handleUserSend}
          renderSend={this.renderSend}
          renderComposer={this.renderComposer}
          renderFooter={this.renderFooter}
          renderBubble={this.renderBubble}
          renderMessage={this.renderMessage}
          renderMessageText={this.renderMessageText}
        />
      </View>
    );
  }
}

export default (HelpScreenStack = StackNavigator({
  Help: {
    screen: HelpScreen,
    navigationOptions: backButtonNavOptions
  }
}));

const imageDim = 150;

const styles = StyleSheet.create({
  instructions: {
    marginTop: 20,
    marginHorizontal: 25,
    lineHeight: 20,
    textAlign: "center"
  },
  agentPosition: {},
  agentName: {
    marginTop: 15,
    fontSize: 25
  },
  agentImage: {
    height: imageDim,
    width: imageDim,
    borderRadius: imageDim / 2
  },
  footerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    marginBottom: 20,
    fontSize: 16
  },
  input: {
    height: 200,
    paddingHorizontal: 5,
    borderColor: colors.borderLine,
    borderWidth: 1,
    borderRadius: 3,
    fontSize: 16
  },
  ...CHAT_STYLES
});
