import React, { Component } from "react";
import uuidv4 from "uuid/v4";
import {
  WebView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from "react-native";
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
import { SuggestionList } from "./widgets";
import { searchArticles } from "./zendesk";

const AGENT_USER_ID = 0;
const CUSTOMER_USER_ID = 1;

const AGENT_USER = {
  _id: AGENT_USER_ID,
  name: "Eve",
  avatar: require("../images/eve-avatar.jpg")
};
const CUSTOMER_USER = {
  _id: CUSTOMER_USER_ID
};

export default class HelpScreen extends Component {
  static navigationOptions = {
    title: "Help"
  };

  constructor(props) {
    super(props);
    this.state = { messages: [], composerText: "", suggestedArticles: [] };
    this.handleUserSend = this.handleUserSend.bind(this);
    this.handleSelectSuggestion = this.handleSelectSuggestion.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderChatFooter = this.renderChatFooter.bind(this);
    this.sendAgentMessage = this.sendAgentMessage.bind(this);
    this.sendUserMessage = this.sendUserMessage.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.composerText !== prevState.composerText) {
      searchArticles(this.state.composerText).then(res => {
        if (this.state.composerText === "") {
          this.setState({ suggestedArticles: [] });
          return;
        }
        this.setState({ suggestedArticles: res.results });
      });
    }
  }

  sendUserMessage(text, cb) {
    this.setState(
      {
        messages: this.state.messages.concat({
          type: "text",
          _id: uuidv4(),
          text,
          createdAt: new Date(),
          user: CUSTOMER_USER
        })
      },
      cb
    );
  }

  sendAgentMessage(text, additionalProps) {
    this.setState(
      {
        messages: this.state.messages.concat({
          type: "text",
          _id: uuidv4(),
          text,
          user: AGENT_USER,
          ...additionalProps
        })
      },
      () => {
        this.setState({ composerText: "", suggestedArticles: [] });
      }
    );
  }

  handleUserSend(message) {
    const sendOfflineMessage = () =>
      this.sendAgentMessage(
        "Sorry, none of our customer service representatives are online. We will get back to you shortly."
      );
    this.setState({ messages: this.state.messages.concat(message) }, () => {
      this.setState({ composerText: "", suggestedArticles: [] });
      setTimeout(sendOfflineMessage, 1500);
    });
  }

  handleSelectSuggestion({ value }) {
    const articleId = value;
    const article = this.state.suggestedArticles.find(a => a.id === articleId);
    this.sendUserMessage(article.title, () => {
      this.sendAgentMessage(article.body, { isArticleBody: true });
    });
  }

  renderChatFooter() {
    if (this.state.suggestedArticles.length) {
      const articles = this.state.suggestedArticles.map(a => ({
        label: a.title,
        value: a.id
      }));
      return (
        <SuggestionList
          items={articles}
          onSelectSuggestion={this.handleSelectSuggestion}
        />
      );
    }
    return null;
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
        {...props}
        text={this.state.composerText}
        onTextChanged={handleTextChanged}
        placeholder="Type your question here..."
      />
    );
  }

  renderFooter(props) {
    if (props.messages.length > 0) return null;
    return (
      <View style={styles.footerContainer}>
        <Image
          style={styles.agentImage}
          source={require("../images/eve-avatar.jpg")}
        />
        <Text style={styles.agentName}>EVE</Text>
        <Text style={styles.agentPosition}>Customer Support</Text>
        {this.state.composerText !== "" &&
        !this.state.suggestedArticles.length ? (
          <Text style={styles.instructions}>
            Sorry, we can{"'"}t find any matching questions.
            {"\n\n"}Send us the question and we will try to answer you as soon
            as possible.
          </Text>
        ) : (
          <Text style={styles.instructions}>
            To begin, type in your question below. We will try to match you with
            questions in our database.
          </Text>
        )}
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

  renderCustomView(props) {
    const currentMessage = props.currentMessage;
    const injectcss = `
    <style>
    body {
      background-color: ${colors.primaryOrange};
      font-family: Arial;
      font-size: 15px;
      color: white;
    }
    img {
      width: 200px;
    }
    </style>`;
    if (currentMessage.isArticleBody) {
      const text = currentMessage.text.replace(
        new RegExp("////", "g"),
        "https://"
      );
      return (
        <WebView
          contentInset={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{
            backgroundColor: colors.primaryOrange,
            width: 300,
            height: 400
          }}
          source={{ html: injectcss + text }}
          scalesPageToFit={true}
        />
      );
    }
  }

  renderBubble(props) {
    // if (props.currentMessage.isArticleBody) {
    //   const bubbleStyle = {
    //     left: StyleSheet.create({
    //       container: {
    //         flex: 1,
    //         alignItems: "flex-start"
    //       },
    //       wrapper: {
    //         borderRadius: 15,
    //         backgroundColor: "#f0f0f0",
    //         marginRight: 60,
    //         minHeight: 20,
    //         alignItems: "stretch",
    //         justifyContent: "flex-end"
    //       },
    //       containerToNext: {
    //         borderBottomLeftRadius: 3
    //       },
    //       containerToPrevious: {
    //         borderTopLeftRadius: 3
    //       }
    //     }),
    //     right: StyleSheet.create({
    //       container: {
    //         flex: 1,
    //         alignItems: "flex-end"
    //       },
    //       wrapper: {
    //         borderRadius: 15,
    //         backgroundColor: "#0084ff",
    //         marginLeft: 60,
    //         minHeight: 20,
    //         justifyContent: "flex-end"
    //       },
    //       containerToNext: {
    //         borderBottomRightRadius: 3
    //       },
    //       containerToPrevious: {
    //         borderTopRightRadius: 3
    //       }
    //     })
    //   };
    //   return (
    //     <View style={[bubbleStyle[props.position].container]}>
    //       <View style={[bubbleStyle[props.position].wrapper]} />
    //       {this.renderCustomView(props)}
    //     </View>
    //   );
    // }
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
    if (props.currentMessage.isArticleBody) return null;
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
          user={CUSTOMER_USER}
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
          renderChatFooter={this.renderChatFooter}
          renderCustomView={this.renderCustomView}
        />
      </View>
    );
  }
}

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
