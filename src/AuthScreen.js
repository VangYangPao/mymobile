import uuid from "uuid";
import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Picker,
  ScrollView,
  InteractionManager,
  Switch
} from "react-native";
import { NavigationActions } from "react-navigation";
import VectorDrawableView from "./VectorDrawableView";
import t from "tcomb-form-native";
const Form = t.form.Form;

import colors from "./colors";
import Button from "./Button";
import { showAlert } from "./utils";
import { Text } from "./defaultComponents";

let formStyles = Object.assign({}, t.form.Form.stylesheet);
formStyles.controlLabel.normal.color = "white";
formStyles.controlLabel.normal.backgroundColor = "transparent";
formStyles.textbox.normal.borderColor = "white";
formStyles.textbox.normal.color = "white";
formStyles.fieldset.marginTop = 20;
formStyles.fieldset.marginBottom = 10;

const resetToDrawerAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Drawer" })]
});

const UserSignUp = t.struct({
  email: t.String,
  fullName: t.String,
  telephone: t.String,
  password: t.String,
  confirmPassword: t.String
});
const userSignUpOptions = {
  auto: "placeholders",
  fields: {
    email: {
      placeholderTextColor: "white",
      keyboardType: "email-address",
      error: "Insert a valid email"
    },
    fullName: {
      placeholderTextColor: "white",
      error: "Name must not be empty"
    },
    telephone: {
      placeholderTextColor: "white",
      keyboardType: "phone-pad",
      error: "Phone number must not be empty"
    },
    password: {
      secureTextEntry: true,
      placeholderTextColor: "white",
      error: "Password must not be empty"
    },
    confirmPassword: {
      secureTextEntry: true,
      placeholderTextColor: "white"
    }
  }
};

class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    // this.state = { acceptTOS: false };
    this.acceptTOS = false;
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignUp() {
    const formValues = this.form.getValue();
    if (formValues) {
      if (!this.acceptTOS) {
        showAlert(
          "You have to agree with the Terms of Use and Privacy Policy."
        );
        return;
      }
      this.props.navigation.dispatch(resetToDrawerAction);
    }
  }

  render() {
    return (
      <View>
        <ScrollView>
          <View style={styles.container}>
            <View style={{ marginTop: 30, justifyContent: "center" }}>
              <Text style={styles.signUpHeader}>Sign up for microAssure</Text>
            </View>
            <View style={{ flex: 0.1, justifyContent: "center" }}>
              <Form
                ref={form => this.form = form}
                type={UserSignUp}
                options={userSignUpOptions}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textContainerText}>
                I have read, understood and agreed to the
              </Text>
              <TouchableOpacity>
                <Text style={[styles.textContainerText, styles.touchableText]}>
                  Terms of Use
                </Text>
              </TouchableOpacity>
              <Text style={styles.textContainerText}> and </Text>
              <TouchableOpacity>
                <Text style={[styles.textContainerText, styles.touchableText]}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
              <Text style={styles.textContainerText}>.</Text>
            </View>
            <Switch
              ref={tosSwitch => this.tosSwitch = tosSwitch}
              onValueChange={val => {
                // WTF HACK: setState re-renders Form component attached by ref
                // so you do setNativeProps manually
                this.acceptTOS = val;
                this.tosSwitch._rctSwitch.setNativeProps({ value: val });
              }}
              value={false}
              onTintColor={colors.tertiaryGreen}
              style={styles.tosSwitch}
            />
            <View>
              <Button onPress={this.handleSignUp} style={styles.signinButton}>
                Sign Up
              </Button>
              <TouchableOpacity
                onPress={this.props.onNavigateToLogin}
                style={{ marginTop: 20 }}
                activeOpacity={0.5}
              >
                <Text style={[styles.bottomBtn, { marginTop: 10 }]}>
                  Already a member? Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const UserLogin = t.struct({
  email: t.String,
  password: t.String
});
const userLoginOptions = {
  fields: {
    email: {
      keyboardType: "email-address",
      error: "Enter a valid email"
    },
    password: {
      secureTextEntry: true,
      error: "Password must not be empty"
    }
  }
};

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    const formValues = this.refs.form.getValue();
    if (formValues) {
      this.props.navigation.dispatch(resetToDrawerAction);
    }
  }

  render() {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <VectorDrawableView
          resourceName="ic_microassure_white"
          style={styles.logo}
        />
        <Form ref="form" type={UserLogin} options={userLoginOptions} />
        <Button onPress={this.handleLogin} style={styles.signinButton}>
          LOGIN
        </Button>
        <TouchableOpacity
          onPress={this.props.onNavigateToSignUp}
          style={{ marginVertical: 20 }}
          activeOpacity={0.5}
        >
          <Text style={styles.bottomBtn}>New member? Sign Up.</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.props.onNavigateToForgotPassword}
          activeOpacity={0.5}
        >
          <Text style={styles.bottomBtn}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const ForgotPassword = t.struct({
  email: t.String
});
const forgotPasswordOptions = {
  fields: {
    email: {
      label: "Enter your email address, we will send you an email to reset your password.",
      keyboardType: "email-address",
      error: "Enter a valid email"
    }
  }
};

class ForgotPasswordScreen extends Component {
  handlePasswordReset() {
    const formValues = this.refs.form.getValue();
    if (formValues) {
      showAlert("An password reset email has been sent to the email address");
      this.props.onNavigateToLogin();
    }
  }

  render() {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <VectorDrawableView
          resourceName="ic_microassure_white"
          style={styles.logo}
        />
        <Form
          ref="form"
          type={ForgotPassword}
          options={forgotPasswordOptions}
        />
        <Button
          onPress={this.handlePasswordReset.bind(this)}
          style={styles.signinButton}
        >
          SEND EMAIL
        </Button>
        <TouchableOpacity
          onPress={this.props.onNavigateToLogin}
          style={{ marginTop: 20 }}
          activeOpacity={0.5}
        >
          <Text style={[styles.bottomBtn, { marginTop: 10 }]}>
            Already a member? Login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: "Login",
      renderBackgroundImage: false
    };
    this.handleNavigateToLogin = this.handleNavigateToLogin.bind(this);
    this.handleNavigateToSignUp = this.handleNavigateToSignUp.bind(this);
    this.handleNavigateToForgotPassword = this.handleNavigateToForgotPassword.bind(
      this
    );
  }

  handleNavigateToLogin() {
    this.setState({ screen: "Login" });
  }

  handleNavigateToSignUp() {
    this.setState({ screen: "SignUp" });
  }

  handleNavigateToForgotPassword() {
    this.setState({ screen: "ForgotPassword" });
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() =>
      this.setState({ renderBackgroundImage: true })
    );
  }

  render() {
    let screen;
    switch (this.state.screen) {
      case "Login":
        page = (
          <LoginScreen
            navigation={this.props.navigation}
            onNavigateToSignUp={this.handleNavigateToSignUp}
            onNavigateToForgotPassword={this.handleNavigateToForgotPassword}
          />
        );
        break;
      case "SignUp":
        page = (
          <SignUpScreen
            navigation={this.props.navigation}
            onNavigateToLogin={this.handleNavigateToLogin}
          />
        );
        break;
      case "ForgotPassword":
        page = (
          <ForgotPasswordScreen
            navigation={this.props.navigation}
            onNavigateToLogin={this.handleNavigateToLogin}
          />
        );
        break;
      default:
        break;
    }

    let backgroundImage;
    if (this.state.renderBackgroundImage) {
      backgroundImage = (
        <Image
          source={require("../images/background.png")}
          style={styles.backgroundImage}
        />
      );
    } else {
      backgroundImage = null;
    }

    return (
      <View style={styles.page}>
        {backgroundImage}
        {page}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tosSwitch: {
    marginBottom: 20
  },
  touchableText: {
    fontWeight: "bold",
    color: "black"
  },
  textContainerText: {
    color: "white",
    backgroundColor: "transparent"
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: 5
  },
  signinButton: {
    backgroundColor: "#8BC34A"
  },
  signUpHeader: {
    marginBottom: 15,
    fontSize: 26,
    textAlign: "center",
    color: "white",
    backgroundColor: "transparent"
  },
  bottomBtn: {
    textAlign: "center",
    color: "white",
    backgroundColor: "transparent",
    fontSize: 17,
    marginTop: 15
  },
  textinput: {
    height: 50
  },
  container: {
    flex: 1,
    paddingHorizontal: 30
  },
  logo: {
    height: 40
  },
  backgroundImage: {
    // flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: null,
    height: null,
    resizeMode: "cover"
  },
  page: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.primaryOrange
  }
});
