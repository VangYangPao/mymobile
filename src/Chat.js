import { GiftedChat } from "react-native-gifted-chat";
import React, { Component } from "react";
import { Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class ChatScreen extends Component {
  static navigationOptions = {
    title: "Buy insurance",
    drawerLabel: "Buy insurance",
    drawerIcon: ({ tintColor }) => (
      <Icon name="credit-card" size={22} color={tintColor} />
    )
  };

  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.onSend = this.onSend.bind(this);
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hi I'm Carol, please choose the insurance plan you're interested in. 😄",
          createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://www.drive.ai/images/team/Carol.png"
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

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: 1
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24
  }
});
