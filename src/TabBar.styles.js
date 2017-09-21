import colors from "./colors";
export default (styles = {
  tabItem: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.softBorderLine
  },
  tabIndicator: {
    backgroundColor: colors.primaryOrange,
    height: 4
  },
  tabLabel: {
    fontWeight: "600"
  },
  tabContainer: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    elevation: 5,
    shadowColor: colors.borderLine,
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    backgroundColor: "white"
  }
});
