import colors from "./colors";
export default (styles = {
  tabIndicator: {
    backgroundColor: colors.primaryOrange,
    height: 3
  },
  tabLabel: {
    fontWeight: "600"
  },
  tabContainer: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    elevation: 5,
    shadowColor: colors.borderLine,
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    backgroundColor: "white"
  }
});
