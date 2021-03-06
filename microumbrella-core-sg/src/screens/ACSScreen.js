import React, { Component } from "react";
import { WebView } from "react-native";

const html = `<HTML>




<HEAD>
<TITLE>Send PARes to TermUrl</TITLE>
</HEAD>
<BODY>
<FORM NAME="postPAResToMPIForm" ACTION="null" METHOD="post">
<input type="hidden" name="csrf" value="null">
<TABLE BORDER="1" CELLPADDING="10" CELLSPACING="0" ALIGN="center">
<TR>
<TD ALIGN="center">
<TABLE BORDER="0" CELLPADDING="5" CELLSPACING="0">

    <TR> 
        <TH COLSPAN="2" ALIGN="center"> 
            <FONT SIZE="+2">
                Wirecard MPI Simulator
            </FONT>
        </TH>
    </TR>

    <TR> 
        <TH ALIGN="center" COLSPAN="2">
            <FONT COLOR="red">
                Click Submit to proceed the transaction. 
            </FONT>
        </TH>   
    </TR>

    <TR>
        <TD ALIGN="center" COLSPAN="2">
            <INPUT TYPE="submit" value="Submit">
            <INPUT TYPE="hidden" NAME="PaRes" VALUE="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">
            <INPUT TYPE="hidden" NAME="MD" VALUE="null">

        </TD>
    </TR>

</TABLE>
</TD>
</TR>
</TABLE>
</FORM>
</BODY>
</HTML>

`;

export default class ACSScreen extends Component {
  static navigationOptions = {
    title: "Confirm Payment"
  };

  render() {
    // const { acsRedirectionHTML } = this.props.navigation.state.params;
    return <WebView source={{ html: html }} />;
  }
}
