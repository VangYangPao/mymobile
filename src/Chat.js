// @flow
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
  Keyboard,
  InteractionManager
} from "react-native";
import {
  GiftedChat,
  Message,
  Bubble,
  MessageText,
  InputToolbar,
  Composer,
  Send,
  Actions
} from "react-native-gifted-chat";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import Spinner from "react-native-spinkit";
import Sound from "react-native-sound";
import Fuse from "fuse.js";
import { template } from "lodash";
import { NavigationActions } from "react-navigation";
import Parse from "parse/react-native";

import { saveNewClaim } from "./parse/claims";
import CheckoutModal from "./CheckoutModal";
import {
  MultiInput,
  MultipleImagePicker,
  ClaimPolicyChoice,
  MyDatePicker,
  CoverageDurationWidget,
  ImageTable,
  ChoiceList,
  SuggestionList,
  PlansTabView,
  TableInput
} from "./widgets";
import TravelPlansView from "./TravelPlansView";
import database from "./HackStorage";
// import PlanCarousel from "./PlanCarousel";
// import TravelInsurancePlanCarousel from "./TravelInsurancePlanCarousel";
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
import CHAT_STYLES from "./Chat.styles";
import { MESSAGE_LOAD_TIME as _MESSAGE_LOAD_TIME } from "react-native-dotenv";
import { showAlert } from "./utils";

// Enable playback in silence mode (iOS only)
Sound.setCategory("Playback");

const MESSAGE_LOAD_TIME = parseInt(_MESSAGE_LOAD_TIME, 10);
const POLICIES_FADE_IN_TIME = 400;

const AGENT_USER_ID = 0;
const CUSTOMER_USER_ID = 1;

const AGENT_USER = {
  _id: AGENT_USER_ID,
  name: "Carol",
  avatar: require("../images/eve-avatar.jpg")
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

let loggedIn = false;

export default function ChatScreenWrapper() {
  function wrapper(props: any) {
    const routeParams = props.navigation.state.params;
    const { questionSet, policy, isStartScreen } = routeParams;

    // if (!routeParams && _questionSet === "buy") {
    //   isStartScreen = true;
    // } else if (routeParams && _questionSet === "buy" && !routeParams.policy) {
    //   isStartScreen = true;
    // } else if (
    //   routeParams &&
    //   routeParams.isStartScreen &&
    //   _questionSet === "buy"
    // ) {
    //   isStartScreen = true;
    // } else {
    //   isStartScreen = false;
    // }
    return (
      <ChatScreen
        isStartScreen={isStartScreen}
        questionSet={questionSet}
        policy={policy}
        {...props}
      />
    );
  }

  wrapper.navigationOptions = ({ navigation }) => {
    const { questionSet } = navigation.state.params;
    let drawerLabel;
    let drawerIcon;
    if (questionSet === "buy") {
      drawerLabel = "Buy Policies";
      drawerIcon = "message";
    } else if (questionSet === "claim") {
      drawerLabel = "Claim Policies";
      drawerIcon = "attach-money";
    }
    return {
      title: "microUmbrella",
      headerTitleStyle: {
        fontWeight: "300"
      },
      drawerLabel,
      drawerIcon: ({ tintColor }) => (
        <Icon name={drawerIcon} size={22} color={tintColor} />
      )
    };
  };

  return wrapper;
}

const WINDOW_HEIGHT = Dimensions.get("window").height;

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errLoadingPoliciesMsg: null,
      loadingPolicies: true,
      policies: null,
      currentUser: null,
      idNumberType: "nric",
      renderActionsPicker: false,
      composerText: "",
      keyboardHeight: 0,
      messages: [],
      minInputToolbarHeight: 44,
      answering: true,
      renderInput: true,
      currentQuestionIndex: -1,
      imageProps: [],
      answers: {
        fullName: null,
        planIndex: null
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
    this.renderChatFooter = this.renderChatFooter.bind(this);
    this.renderActions = this.renderActions.bind(this);

    this.handleUserSend = this.handleUserSend.bind(this);
    this.handleAgentSend = this.handleAgentSend.bind(this);
    this.handleSelectSuggestion = this.handleSelectSuggestion.bind(this);
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
    this.handleTableInputSubmit = this.handleTableInputSubmit.bind(this);
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
          // console.log("failed to load the sound", error);
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
              text:
                "Hello, I'm Eve. Welcome to microUmbrella. I'll be your host and here are the protection plans that may interest you. 😄",
              createdAt: new Date(),
              user: AGENT_USER
            }
          ]
        },
        () => setTimeout(renderPolicyChoice, POLICIES_FADE_IN_TIME)
      );
    }, MESSAGE_LOAD_TIME);
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
      InteractionManager.runAfterInteractions(() => {
        const messages = this.state.messages.slice();
        messages.splice(messageIndex, 1, message);
        this.setState({ renderInput: true, messages: messages }, () => {
          this.playNewMessageSound();
          if (typeof cb === "function") {
            cb();
          }
        });
      });
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
        setTimeout(afterLoading, MESSAGE_LOAD_TIME);
      }
    );
  }

  handleSelectSuggestion(suggestion) {
    this.setState(
      this.concatMessageUpdater({
        type: "text",
        _id: uuid.v4(),
        text: `${suggestion.label}`,
        value: suggestion.value,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handleSelectPolicy(policyTitle) {
    const policy = transposePolicyChoiceByTitle()[policyTitle];
    const { currentUser } = this.state;
    const params = { policy, page: "info", currentUser };
    this.props.navigation.navigate("Policy", params);
  }

  handleSelectTravelInsurancePlan(planIndex) {
    const planID = [1, 2, 84, 85];
    const plans = ["Basic", "Enhanced", "Superior", "Premier"];
    const { messages } = this.state;
    let newMessages = messages.slice();
    const messagesLen = messages.length;
    const planMessage = {
      type: "text",
      _id: uuid.v4(),
      text: `${plans[planIndex]} plan`,
      value: planID[planIndex],
      user: CUSTOMER_USER
    };
    newMessages.splice(messagesLen - 1, 1, planMessage);
    this.setState({ messages: newMessages }, () =>
      this.setState({ answering: false, renderInput: true })
    );
  }

  handleSelectPlan(planIndex) {
    const planAlphabet = ["A", "B", "C", "D", "E"];
    const premium = this.props.policy.plans[planIndex].premium;
    const planMessage = {
      type: "text",
      _id: uuid.v4(),
      text: `I choose Plan ${planAlphabet[planIndex]}`,
      value: planIndex,
      user: CUSTOMER_USER
    };
    const { messages } = this.state;
    let newMessages = messages.slice();
    const messagesLen = messages.length;
    newMessages.splice(messagesLen - 1, 1, planMessage);
    this.setState({ messages: newMessages }, () =>
      this.setState({ answering: false, renderInput: true })
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
    const { currentQuestionIndex } = this.state;
    const currentQuestionId = this.questions[currentQuestionIndex].id;
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
      () => {
        const imageProps = Object.assign([], this.state.imageProps);
        imageProps.push(currentQuestionId);
        this.setState({ imageProps, answering: false, renderInput: true });
      }
    );
  }

  handleSelectPolicyToClaim(policy) {
    const policyId = policy.get("policyId");
    const policyTypeId = policy.get("policyTypeId");
    const { title } = POLICIES.find(p => p.id === policyTypeId);
    let answers = Object.assign(this.state.answers, {
      policyName: title
    });
    this.setState({ answers });

    if (policyTypeId.indexOf("pa") !== -1) {
      this.questions.push.apply(this.questions, paClaimQuestions);
    } else if (policyTypeId.indexOf("travel") !== -1) {
      this.questions.push.apply(this.questions, travelClaimQuestions);
    } else if (policyTypeId.indexOf("mobile") !== -1) {
      this.questions.push.apply(this.questions, mobileClaimQuestions);
    }

    this.setState(
      this.concatMessageUpdater({
        type: "text",
        _id: uuid.v4(),
        text: `I want to claim policy ${title} (${policyId})`,
        value: policyId,
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

  handleTableInputSubmit(items) {
    let { messages } = this.state;
    messages = messages.slice(0, messages.length - 1);
    messages = messages.concat({
      type: "text",
      _id: uuid.v4(),
      text: "These are the details of my spouse and children",
      value: items,
      user: CUSTOMER_USER
    });
    this.setState({ messages }, () =>
      this.setState({ answering: false, renderInput: true })
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
    Parse.User
      .currentAsync()
      .then(currentUser => {
        if (currentUser) {
          const fullName =
            currentUser.get("firstName") + " " + currentUser.get("lastName");
          let answers = Object.assign({}, this.state.answers);
          answers.fullName = fullName;
          this.setState({ currentUser, answers });
          const { policy, isStartScreen, questionSet } = this.props;
          if (this.props.questionSet === "claim") {
            const Purchase = Parse.Object.extend("Purchase");
            const query = new Parse.Query(Purchase);
            query.equalTo("user", currentUser);
            query.descending("createdAt");
            query
              .find()
              .then(policies => {
                this.setState({ loadingPolicies: false, policies });
              })
              .catch(err => {
                this.setState({
                  loadingPolicies: false,
                  errLoadingPoliciesMsg: err
                });
              });
          }
          const setParamsAction = NavigationActions.setParams({
            params: {
              questionSet: "buy",
              policy,
              isStartScreen,
              currentUser,
              fullName
            },
            key: "Chat"
          });
          // console.log(this.props.navigation.state);
          // this.props.navigation.dispatch(setParamsAction);
          this.props.navigation.setParams({
            questionSet,
            policy,
            isStartScreen,
            currentUser
          });
        }
        if (this.props.isStartScreen) {
          this.renderStartScreenMessages();
        } else {
          // trigger the initial componentDidUpdate
          this.setState({ answering: false });
        }
      })
      .catch(err => console.error(err));

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
          const { currentUser } = this.state;
          const params = { policy, page: "checkout" };
          // this.props.navigation.navigate("Policy", params);
          let form = Object.assign({}, this.state.answers);
          form.policy = this.props.policy;
          const { planIndex } = form;
          // delete form.policy;
          // delete form.planIndex;
          delete form.icImage;
          if (policy.id === "travel") {
            delete form.price;
          }
          this.props.navigation.navigate("Confirmation", { form, currentUser });
        } else if (questionSet === "claim") {
          const purchase = this.state.policies.find(
            p => p.get("policyId") === this.state.answers.claimPolicyNo
          );
          const policyTypeId = purchase.get("policyTypeId");
          console.log(
            policyTypeId,
            this.state.answers,
            purchase,
            this.state.imageProps,
            this.state.currentUser
          );
          saveNewClaim(
            policyTypeId,
            this.state.answers,
            purchase,
            this.state.imageProps,
            this.state.currentUser
          )
            .then(res => {
              console.log(res);
              showAlert("Thank you! Your claim has been submitted.", () => {
                this.props.navigation.navigate("MyPolicies");
              });
            })
            .catch(err => {
              console.error(err);
              showAlert("Sorry, something went wrong with your claim.", () => {
                this.props.navigation.navigate("MyPolicies");
              });
            });
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
        const policy = this.state.policies.find(
          p => p.get("policyId") === this.state.answers.claimPolicyNo
        );
        checkAgainst = policy.get("policyTypeId");
        if (nextQuestion.id !== "accidentType") {
          checkAgainst = this.state.answers.accidentType;
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
      Keyboard.dismiss();
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

    const transformOldWidgets = inputs => {
      return inputs.map(input => ({
        label: input.label,
        responseType: "string",
        id: input.id
      }));
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
        appendWidget("multiInput", { columns: transformOldWidgets(inputs) });
        return;
      }
      const widgets = [
        "planIndex",
        "coverageDuration"
        // "travelDetails"
      ];
      if (widgets.indexOf(currentQuestion.id) !== -1) {
        appendWidget(currentQuestion.id);
        return;
      }
      if (currentQuestion.id === "claimPolicyNo") {
        //her
        appendWidget("claimPolicyNo");
        return;
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
        if (type === "multiInput") {
          const { columns } = currentQuestion;
          appendWidget("multiInput", { columns });
        }
        if (type === "table") {
          const { columns } = currentQuestion;
          appendWidget("table", { columns });
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
      this.setState({ composerText: "" });
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
        let answer =
          lastMessage.value !== undefined
            ? lastMessage.value
            : lastMessage.text.trim();

        if (
          lastQuestion.responseType.indexOf("number") !== -1 &&
          !isNaN(answer) &&
          typeof answer === "string"
        ) {
          answer = parseFloat(answer);
        }
        let result = validateAnswer(lastQuestion, answer, this.state.answers);

        if (Array.isArray(result)) {
          const isValid = result.every(r => r.isValid);
          result = { isValid };
        }

        if (result.isValid) {
          let newAnswer = {};
          if (lastMessage.multi) {
            answer.forEach(input => {
              newAnswer[input.id] = input.value;
            });
          } else {
            newAnswer[lastQuestion.id] =
              lastMessage.value !== undefined
                ? lastMessage.value
                : lastMessage.text;
          }
          const answers = Object.assign(this.state.answers, newAnswer);
          /// setState here
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
    const { currentQuestionIndex } = this.state;
    let currentQuestion;
    if (currentQuestionIndex >= 0) {
      currentQuestion = this.questions[currentQuestionIndex];
    }
    switch (currentMessage.type) {
      case "claimPolicyNo":
        const { policies } = currentMessage;
        const { currentUser } = this.props.navigation.state.params;
        return (
          <ClaimPolicyChoice
            rootNavigation={this.props.screenProps.rootNavigation}
            currentUser={currentUser}
            loadingPolicies={this.state.loadingPolicies}
            errLoadingPoliciesMsg={this.state.errLoadingPoliciesMsg}
            policies={this.state.policies}
            onSelectPolicy={this.handleSelectPolicyToClaim}
          />
        );
      case "table":
        return (
          <TableInput
            itemName="traveller"
            navigation={this.props.navigation}
            keyboardHeight={this.state.keyboardHeight}
            question={currentQuestion}
            onSubmit={this.handleTableInputSubmit}
            columns={currentMessage.columns}
          />
        );
      case "multiInput":
        return (
          <MultiInput
            keyboardHeight={this.state.keyboardHeight}
            question={currentQuestion}
            onSubmit={this.handleMultiInputSubmit}
            columns={currentMessage.columns}
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
            <TravelPlansView
              onSelectPlan={this.handleSelectTravelInsurancePlan}
            />
            // <TravelInsurancePlanCarousel
            //   {...carouselProps}
            //   {...additionalProps}
            //   onSelectPlan={this.handleSelectTravelInsurancePlan}
            // />
          );
        }
        return (
          <PlansTabView
            onSelectPlan={this.handleSelectPlan}
            plans={this.props.policy.plans}
          />
        );
      // return <PlanCarousel {...carouselProps} />;
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

  renderChatFooter() {
    const { currentQuestionIndex } = this.state;
    if (currentQuestionIndex < 0 || !this.state.renderInput) return null;
    const currentQuestion = this.questions[currentQuestionIndex];

    if (currentQuestion.searchChoices) {
      const fuse = new Fuse(
        currentQuestion.choices,
        currentQuestion.searchOptions
      );
      const matchedItems = fuse.search(this.state.composerText);
      return (
        <SuggestionList
          items={matchedItems}
          onSelectSuggestion={this.handleSelectSuggestion}
        />
      );
    }
    if (currentQuestion.id === "idNumber" && this.state.renderActionsPicker) {
      const choices = [
        { label: "NRIC/FIN", value: "nric" },
        { label: "Passport", value: "passport" }
      ];
      const onSelectChoice = ({ label, value }) => {
        if (value === "nric") {
          this.questions[currentQuestionIndex].responseType = [
            "string",
            "nric"
          ];
        } else if (value === "passport") {
          this.questions[currentQuestionIndex].responseType = ["string"];
        }
        let answers = Object.assign(this.state.answers);
        answers.idNumberType = value;
        this.setState({
          idNumberType: value,
          answers,
          renderActionsPicker: false
        });
      };
      return (
        <SuggestionList items={choices} onSelectSuggestion={onSelectChoice} />
      );
    }
    return null;
  }

  renderComposer(props) {
    const { currentQuestionIndex } = this.state;
    if (currentQuestionIndex < 0) return;
    const currentQuestion = this.questions[currentQuestionIndex];
    let { responseType } = currentQuestion;
    responseType = [].concat(responseType);

    const dateIndex = responseType.indexOf("date");
    const dateTimeIndex = responseType.indexOf("datetime");

    if (dateIndex !== -1 || dateTimeIndex !== -1) {
      let index;
      if (dateIndex !== -1) {
        index = dateIndex;
      } else {
        index = dateTimeIndex;
      }
      const pickerMode = responseType[index];
      let minDateFrom;
      if (currentQuestion.minDateFrom) {
        minDateFrom = this.state.answers[currentQuestion.minDateFrom];
      }
      if (
        !this.state.answering ||
        !this.state.renderInput ||
        this.props.isStartScreen
      ) {
        return <Composer placeholder="Type your message here..." {...props} />;
      }
      return (
        <MyDatePicker
          pastOnly={currentQuestion.pastOnly}
          futureOnly={currentQuestion.futureOnly}
          minDate={minDateFrom}
          mode={pickerMode}
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
    const handleTextChanged = text => {
      this.setState({ composerText: text }, () => props.onTextChanged(text));
    };
    return (
      <Composer
        placeholder="Type your message here..."
        {...props}
        text={this.state.composerText}
        onTextChanged={handleTextChanged}
        textInputProps={textInputProps}
      />
    );
  }

  renderSend(props) {
    const { currentQuestionIndex } = this.state;
    if (currentQuestionIndex < 0 || !this.state.renderInput) return null;
    const currentQuestion = this.questions[currentQuestionIndex];

    if (!currentQuestion.searchChoices) {
      return <Send {...props} textStyle={styles.sendButton} />;
    }
  }

  renderActions(props) {
    const { currentQuestionIndex } = this.state;
    if (currentQuestionIndex < 0 || !this.state.renderInput) return null;
    const currentQuestion = this.questions[currentQuestionIndex];

    if (currentQuestion.id === "idNumber") {
      const mapping = {
        nric: "NRIC/FIN",
        passport: "Passport"
      };
      return (
        <TouchableOpacity
          onPress={() =>
            this.setState({
              renderActionsPicker: !this.state.renderActionsPicker
            })}
          style={{
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center"
          }}
        >
          <Text style={styles.idNumberTypeText}>
            {mapping[this.state.idNumberType]}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    // return <CheckoutModal purchasing={true} price={13.599} purchasing={true} />;
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
          renderActions={this.renderActions}
          renderTime={() => {}}
          renderDay={() => {}}
          renderBubble={this.renderBubble}
          renderMessage={this.renderMessage}
          renderMessageText={this.renderMessageText}
          renderSend={this.renderSend}
          renderComposer={this.renderComposer}
          renderChatFooter={this.renderChatFooter}
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
  idNumberTypeText: {
    marginLeft: 7,
    marginTop: Platform.select({ ios: -5, android: 0 }),
    color: colors.primaryOrange,
    fontSize: 15
  },
  datetimeInput: {},
  datetimeContainer: {
    flex: 1
  },
  spinner: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10
  },
  ...CHAT_STYLES
});
