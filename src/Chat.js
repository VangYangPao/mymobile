import uuid from "uuid";
import React, { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  View,
  ScrollView,
  Platform,
  Alert,
  ToastAndroid,
  Keyboard
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
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import Spinner from "react-native-spinkit";
import Sound from "react-native-sound";
import { template } from "lodash";

import {
  MultiInput,
  MultipleImagePicker,
  ClaimPolicyChoice,
  MyDatePicker,
  CoverageDurationWidget,
  ImageTable,
  ChoiceList
} from "./widgets";
import database from "./HackStorage";
import PlanCarousel from "./PlanCarousel";
import TravelInsurancePlanCarousel from "./TravelInsurancePlanCarousel";
import { Text } from "./defaultComponents";
import PolicyChoice from "./PolicyChoice";
import colors from "./colors";
import POLICIES from "../data/policies";
import {
  validateAnswer,
  QUESTION_SETS,
  paClaimQuestions,
  travelClaimQuestions,
  mobileClaimQuestions
} from "../data/questions";
import Button from "./Button";

// Enable playback in silence mode (iOS only)
Sound.setCategory("Playback");

const FIRST_MSG_LOAD_TIME = 500;
const POLICIES_FADE_IN_TIME = 400;

const AGENT_USER_ID = 0;
const CUSTOMER_USER_ID = 1;

const AGENT_USER = {
  _id: AGENT_USER_ID,
  name: "Carol",
  avatar: require("../images/eve.png")
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
    // have to reassign to _questionSet here
    // solves weird scoping issue where questionSet will remain to be 'buy'
    // when going back in the stack
    let _questionSet = questionSet;
    const routeParams = props.navigation.state.params;
    const isStartScreen = !routeParams && !_questionSet;
    let policy;
    if (routeParams) {
      _questionSet = _questionSet || routeParams.questionSet;
      policy = routeParams.policy;
    }
    return (
      <ChatScreen
        isStartScreen={isStartScreen}
        questionSet={_questionSet}
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
    title: "microUmbrella",
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

const WINDOW_HEIGHT = Dimensions.get("window").height;

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboardHeight: 0,
      messages: [],
      minInputToolbarHeight: 44,
      answering: true,
      renderInput: true,
      currentQuestionIndex: -1,
      answers: {
        fullName: "Denzel Tan",
        policy: props.policy,
        planIndex: 0,
        coverageDuration: 12
      }
    };

    if (props.questionSet) {
      this.questions = QUESTION_SETS[props.questionSet];
    }

    this.renderMessage = this.renderMessage.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderMessageText = this.renderMessageText.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.renderSend = this.renderSend.bind(this);

    this.handleUserSend = this.handleUserSend.bind(this);
    this.handleAgentSend = this.handleAgentSend.bind(this);
    this.handleSelectPolicy = this.handleSelectPolicy.bind(this);
    this.handleSelectPlan = this.handleSelectPlan.bind(this);
    this.handleSelectTravelInsurancePlan = this.handleSelectTravelInsurancePlan.bind(
      this
    );
    this.handleSelectDuration = this.handleSelectDuration.bind(this);
    this.handleFinishSelectImages = this.handleFinishSelectImages.bind(this);
    this.handleFinishImageTable = this.handleFinishImageTable.bind(this);
    this.handlePickImage = this.handlePickImage.bind(this);
    this.handlePickDate = this.handlePickDate.bind(this);
    this.handlePickChoice = this.handlePickChoice.bind(this);
    this.handleSelectPolicyToClaim = this.handleSelectPolicyToClaim.bind(this);
    this.handleMultiInputSubmit = this.handleMultiInputSubmit.bind(this);
    this.renderStartScreenMessages = this.renderStartScreenMessages.bind(this);
    this.askNextQuestion = this.askNextQuestion.bind(this);
    this.reaskQuestion = this.reaskQuestion.bind(this);
    this.sendNewMessage = this.sendNewMessage.bind(this);

    this.concatMessageUpdater = message => {
      return prevState => {
        return { messages: prevState.messages.concat(message) };
      };
    };

    this.concatMessage = message => {
      this.setState({ messages: this.state.messages.concat(message) });
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
      this.concatMessage({
        type: "policies",
        _id: 1,
        user: AGENT_USER
      });
    };

    const sendFirstMessage = setTimeout(() => {
      this.setState(
        {
          messages: [
            {
              type: "text",
              _id: 0,
              text: "Hello, I'm Eve. Welcome to microUmbrella. I'll be your host and here are the protection plans that may interest you. 😄",
              createdAt: new Date(),
              user: AGENT_USER
            }
          ]
        },
        () => setTimeout(renderPolicyChoice, POLICIES_FADE_IN_TIME)
      );
    }, FIRST_MSG_LOAD_TIME);
  }

  handleUserSend(messages) {
    this.setState(this.concatMessageUpdater(messages), () => {
      this.setState({ answering: false });
    });
  }

  handleAgentSend(message, cb) {
    const loadingMessage = {
      type: "loading",
      _id: uuid.v4(),
      text: "loading",
      createdAt: new Date(),
      user: AGENT_USER
    };
    let messageIndex;
    const afterLoading = () => {
      const messages = this.state.messages.slice();
      messages.splice(messageIndex, 1, message);
      this.setState({ renderInput: true, messages: messages }, cb);
      this.playNewMessageSound();
    };
    this.setState(
      prevState => {
        messageIndex = prevState.messages.length;
        return {
          renderInput: false,
          messages: prevState.messages.concat(loadingMessage)
        };
      },
      () => {
        setTimeout(afterLoading, 1500);
      }
    );
  }

  handleSelectPolicy(policyTitle) {
    const policy = transposePolicyChoiceByTitle()[policyTitle];
    const params = { policy, page: "info" };
    this.props.navigation.navigate("Policy", params);
  }

  handleSelectTravelInsurancePlan(planIndex, price) {
    const plans = ["Basic", "Enhanced", "Superior"];
    const answers = Object.assign(this.state.answers, { price });
    this.setState(
      this.concatMessageUpdater({
        type: "text",
        _id: uuid.v4(),
        text: `${plans[planIndex]} plan`,
        value: planIndex,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true, answers })
    );
  }

  handleSelectPlan(planIndex) {
    const planAlphabet = ["A", "B", "C", "D", "E"];
    const premium = this.props.policy.plans[planIndex].premium;
    this.setState(
      this.concatMessageUpdater({
        type: "text",
        _id: uuid.v4(),
        text: `I choose Plan ${planAlphabet[planIndex]}`,
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
      this.concatMessageUpdater({
        type: "text",
        _id: uuid.v4(),
        text: `I want to be covered for ${months} month${s}`,
        value: months,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handlePickDate(mode, date) {
    const format = mode === "datetime" ? "YYYY-MM-DD HH:mm A" : "YYYY-MM-DD";
    const dateStr = moment(date).format(format);
    this.setState(
      this.concatMessageUpdater({
        type: "text",
        _id: uuid.v4(),
        user: CUSTOMER_USER,
        value: date,
        text: `${dateStr}`
      }),
      () => this.setState({ answering: false })
    );
  }

  handlePickImage(imageUri) {
    this.setState(
      this.concatMessageUpdater({
        type: "text",
        _id: uuid.v4(),
        user: CUSTOMER_USER,
        value: imageUri,
        image: imageUri
      }),
      () => this.setState({ answering: false })
    );
  }

  handlePickChoice(label, value) {
    this.setState(
      this.concatMessageUpdater({
        type: "text",
        _id: uuid.v4(),
        user: CUSTOMER_USER,
        value,
        text: label
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handleFinishSelectImages(imagesUri) {
    const s = imagesUri.length > 1 ? "s" : "";
    this.setState(
      this.concatMessageUpdater({
        type: "text",
        _id: uuid.v4(),
        text: imagesUri.length
          ? `These are the ${imagesUri.length} photo${s} you requested.`
          : "I prefer to skip this",
        value: imagesUri,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handleFinishImageTable(images) {
    const imageLen = Object.keys(images).length;
    const s = imageLen > 1 ? "s" : "";
    this.setState(
      this.concatMessageUpdater({
        type: "text",
        _id: uuid.v4(),
        text: imageLen
          ? `These are the ${imageLen} photo${s} you requested.`
          : "I prefer to skip this",
        value: images,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handleSelectPolicyToClaim(policy) {
    const { title } = POLICIES.find(p => p.id === policy.policyType);
    let answers = Object.assign(this.state.answers, {
      policyName: title
    });
    this.setState({ answers });

    if (policy.policyType.indexOf("pa") !== -1) {
      this.questions.push.apply(this.questions, paClaimQuestions);
    } else if (policy.policyType.indexOf("travel") !== -1) {
      this.questions.push.apply(this.questions, travelClaimQuestions);
    } else if (policy.policyType.indexOf("mobile") !== -1) {
      this.questions.push.apply(this.questions, mobileClaimQuestions);
    }

    this.setState(
      this.concatMessageUpdater({
        type: "text",
        _id: uuid.v4(),
        text: `I want to claim policy ${title} (PL${policy.id})`,
        value: policy.id,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handleDownload() {
    this.setState(
      this.concatMessageUpdater({
        type: "text",
        _id: uuid.v4(),
        text: "I have printed and filled up, I am ready with the next step.",
        value: true,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handleMultiInputSubmit(inputs) {
    let { messages } = this.state;
    messages = messages.slice(0, messages.length - 1);
    messages = messages.concat({
      type: "text",
      _id: uuid.v4(),
      text: inputs.map(i => i.value).join(" "),
      value: inputs,
      user: CUSTOMER_USER,
      multi: true
    });
    this.setState({ messages }, () =>
      this.setState({ answering: false, renderInput: true })
    );
  }

  componentDidMount() {
    if (this.props.isStartScreen) {
      this.renderStartScreenMessages();
    } else {
      // trigger the initial componentDidUpdate
      this.setState({ answering: false });
    }
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide.bind(this)
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow(e) {
    const keyboardHeight = e.endCoordinates.height;
    this.setState({ keyboardHeight });
  }

  _keyboardDidHide(e) {
    this.setState({ keyboardHeight: 0 });
  }

  sendNewMessage(msgText, cb) {
    this.handleAgentSend(
      {
        _id: uuid.v4(),
        type: "text",
        text: msgText,
        createdAt: new Date(),
        user: AGENT_USER
      },
      cb
    );
  }

  reaskQuestion(errMessage) {
    this.sendNewMessage(errMessage);
    this.setState({ answering: true });
  }

  askNextQuestion() {
    const currentQuestionIndex = this.state.currentQuestionIndex + 1;

    // end the questionnaire and redirect user to checkout page
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
          if (policy.id === "travel") {
            form.totalPremium = new Number(form.price);
            delete form.price;
          } else {
            form.totalPremium =
              this.props.policy.plans[planIndex].premium *
              form.coverageDuration;
          }
          this.props.navigation.navigate("Confirmation", { form });
        } else if (questionSet === "claim") {
          const policyIndex = database.policies.findIndex(
            p => p.id === this.state.answers.claimPolicyNo
          );
          const policy = database.policies[policyIndex];
          const { id, paid, policyType, purchaseDate } = policy;
          database.claims.push({
            id,
            paid,
            purchaseDate,
            status: "pending",
            amount: 1000
          });
          database.policies.splice(policyIndex, 1);
          if (Platform.OS === "ios") {
            Alert.alert("Thank you!", "Your claim has been submitted.", [
              {
                text: "OK",
                onPress: () => this.props.navigation.navigate("Status")
              }
            ]);
          } else {
            ToastAndroid.show(
              "Thank you! Your claim has been submitted.",
              ToastAndroid.LONG
            );
            this.props.navigation.navigate("Status");
          }
        }
      }, 2000);
      return;
    }

    const nextQuestion = this.questions[currentQuestionIndex];
    let checkAgainst;
    if (this.props.questionSet !== "claim") {
      checkAgainst = this.props.policy.id;
    } else {
      if (this.state.answers.claimPolicyNo) {
        const policy = database.policies.find(
          p => p.id === this.state.answers.claimPolicyNo
        );
        checkAgainst = policy.policyType;
        if (nextQuestion.id !== "claimType") {
          checkAgainst = this.state.answers.claimType;
        }
      }
    }
    // skip questions here
    if (
      nextQuestion.include !== undefined &&
      nextQuestion.include.indexOf(checkAgainst) === -1
    ) {
      this.setState({ currentQuestionIndex }, this.askNextQuestion);
      return;
    }
    if (
      nextQuestion.exclude !== undefined &&
      nextQuestion.exclude.indexOf(checkAgainst) !== -1
    ) {
      this.setState({ currentQuestionIndex }, this.askNextQuestion);
      return;
    }
    // eval only when needed
    if (nextQuestion.condition) {
      if (!eval(nextQuestion.condition)) {
        // condition is not met
        this.setState({ currentQuestionIndex }, this.askNextQuestion);
        return;
      }
    }

    const nextQuestionText = template(nextQuestion.question)(
      this.state.answers
    );

    const appendWidget = (key, additionalProps) => {
      this.setState(
        {
          messages: this.state.messages.concat({
            type: key,
            _id: uuid.v4(),
            user: AGENT_USER,
            ...additionalProps
          })
        },
        () => this.setState({ renderInput: false })
      );
    };

    const handleAppendWidget = () => {
      const currentQuestion = this.questions[this.state.currentQuestionIndex];
      if (currentQuestion.responseType === null) {
        this.askNextQuestion();
        return;
      }
      if (currentQuestion.id instanceof Array) {
        const inputs = currentQuestion.id.map((id, idx) => ({
          id,
          type: currentQuestion.responseType[idx],
          label: currentQuestion.labels[idx]
        }));
        appendWidget("multiInput", { inputs });
        return;
      }
      const widgets = [
        "planIndex",
        "coverageDuration",
        "claimPolicyNo"
        // "travelDetails"
      ];
      const typeWidgets = ["images", "imageTable", "choice"];
      if (widgets.indexOf(currentQuestion.id) !== -1) {
        appendWidget(currentQuestion.id);
      }
      const responseTypes = [].concat(currentQuestion.responseType);
      responseTypes.forEach(type => {
        if (type === "images") appendWidget("images");
        if (type === "choice") {
          appendWidget("choice", { choices: currentQuestion.choices });
        }
        if (type === "imageTable") {
          const { columns } = currentQuestion;
          appendWidget("imageTable", { columns });
        }
        // appendWidget(type, currentQuestion);
      });
    };

    const handleAfterSendMessage = () => {
      this.setState(
        {
          currentQuestionIndex,
          answering: true
        },
        handleAppendWidget
      );
    };

    this.sendNewMessage(nextQuestionText, handleAfterSendMessage);
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentQuestionIndex } = this.state;
    if (
      prevState.answering !== this.state.answering ||
      prevState.renderInput !== this.state.renderInput
    ) {
      this.refs.chat.resetInputToolbar();
    }
    if (currentQuestionIndex >= 0) {
      const currentQuestion = this.questions[currentQuestionIndex];
      if (currentQuestion.responseType !== null) {
        this.refs.chat.resetInputToolbar();
      }
    }

    if (this.state.answering !== prevState.answering && !this.state.answering) {
      const { messages } = this.state;

      // skip validation for bootstrap step-0
      if (messages.length === 0) {
        this.askNextQuestion();
      } else {
        const lastMessage = messages[messages.length - 1];
        const lastQuestion = this.questions[currentQuestionIndex];

        // just ignore checking the response if null
        if (lastQuestion.responseType === null) {
          return;
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
        console.log(answer);
        const result = validateAnswer(lastQuestion, answer);

        if (result.isValid) {
          let newAnswer = {};
          if (lastMessage.multi) {
            answer.forEach(input => {
              newAnswer[input.id] = input.value;
            });
          } else {
            newAnswer[lastQuestion.id] = lastMessage.value !== undefined
              ? lastMessage.value
              : lastMessage.text;
          }
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
      case "claimPolicyNo":
        return (
          <ClaimPolicyChoice onSelectPolicy={this.handleSelectPolicyToClaim} />
        );
      case "multiInput":
        return (
          <MultiInput
            onSubmit={this.handleMultiInputSubmit}
            inputs={currentMessage.inputs}
          />
        );
      case "choice":
        return (
          <ChoiceList
            choices={currentMessage.choices}
            onPickChoice={this.handlePickChoice}
          />
        );
      case "images":
        return (
          <MultipleImagePicker
            onFinishSelectImages={this.handleFinishSelectImages}
          />
        );
      case "imageTable":
        return (
          <ImageTable
            columns={currentMessage.columns}
            onFinishSelectImages={this.handleFinishImageTable}
          />
        );
      case "policies":
        return <PolicyChoice onSelectPolicy={this.handleSelectPolicy} />;
      case "planIndex":
        const carouselProps = {
          onSelectPlan: this.handleSelectPlan,
          plans: this.props.policy.plans
        };
        if (this.props.policy.isTravelInsurance) {
          const {
            travelDestination,
            recipient,
            departureDate,
            returnDate
          } = this.state.answers;
          var days =
            Math.abs(returnDate - departureDate) / (1000 * 60 * 60 * 24);
          const additionalProps = {
            travelDestination,
            recipient,
            travelDuration: days
          };
          return (
            <TravelInsurancePlanCarousel
              {...carouselProps}
              {...additionalProps}
              onSelectPlan={this.handleSelectTravelInsurancePlan}
            />
          );
        }
        return <PlanCarousel {...carouselProps} />;
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
      case "text":
      default:
        return <Message {...props} containerStyle={messageContainerStyle} />;
    }
  }

  renderComposer(props) {
    const { currentQuestionIndex } = this.state;
    if (currentQuestionIndex < 0) return;
    const currentQuestion = this.questions[currentQuestionIndex];
    let { responseType } = currentQuestion;
    responseType = [].concat(responseType);

    if (responseType.indexOf("date") !== -1) {
      return (
        <MyDatePicker
          allowFuture={currentQuestion.allowFuture}
          mode="date"
          onPickDate={this.handlePickDate}
        />
      );
    } else if (responseType.indexOf("datetime") !== -1) {
      return (
        <MyDatePicker
          allowFuture={currentQuestion.allowFuture}
          mode="datetime"
          onPickDate={this.handlePickDate}
        />
      );
    }

    let keyboardType = "default";
    if (responseType.indexOf("email") !== -1) keyboardType = "email-address";
    if (responseType.indexOf("number") !== -1) keyboardType = "numeric";
    if (responseType.indexOf("phoneNumber") !== -1) keyboardType = "phone-pad";
    let textInputProps = {
      keyboardType,
      autoCorrect: false,
      autoCapitalize: "none"
    };
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
    const { currentQuestionIndex } = this.state;

    let listViewProps = {};
    if (this.state.currentQuestionIndex > 0) {
      listViewProps.onContentSizeChange = (contentWidth, contentHeight) => {
        if (this._messageContainerRef === null) {
          return;
        }
        let scrollHeight = contentHeight;
        if (Platform.OS === "ios") {
          const supposedScrollHeight =
            contentHeight - WINDOW_HEIGHT * 0.8 + this.state.keyboardHeight;
          scrollHeight = supposedScrollHeight < 0 ? 0 : supposedScrollHeight;
        }
        this.refs.chat._messageContainerRef.scrollTo({
          y: scrollHeight,
          animated: true
        });
      };
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
          listViewProps={listViewProps}
        />
      </View>
    );
  }
}

const messageContainerStyle = {
  left: {
    alignItems: "flex-start"
  },
  right: {
    alignItems: "flex-start"
  }
};

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
