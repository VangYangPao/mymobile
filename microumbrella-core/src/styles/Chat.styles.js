import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;

export default (styles = {
  textInput: {
    backgroundColor: colors.softBorderLine
  },
  sendButton: {
    color: colors.primaryAccent
  },
  bubbleLeft: {
    borderRadius: 15,
    backgroundColor: colors.primaryAccent
  },
  messageTextLeft: {
    textDecorationLine: "none",
    color: "white"
  },
  bubbleRight: {
    borderRadius: 15,
    backgroundColor: "white"
  },
  messageTextRight: {
    textDecorationLine: "none",
    color: colors.primaryText
  },
  container: {
    flex: 1,
    paddingTop: 12
  }
});
