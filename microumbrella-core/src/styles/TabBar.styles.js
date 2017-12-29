import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;
export default (styles = {
  tabItem: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.softBorderLine
  },
  tabIndicator: {
    backgroundColor: colors.primaryAccent,
    height: 4
  },
  planTabLabel: {
    fontSize: 11,
    fontWeight: "600"
  },
  tabLabel: {
    fontWeight: "600"
  },
  tabContainer: {
    elevation: 5,
    shadowColor: colors.borderLine,
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    backgroundColor: "white"
  }
});
