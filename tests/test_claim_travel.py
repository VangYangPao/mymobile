from timeout_decorator import timeout
from datetime import date as create_date
from time import sleep

from mu_tests import MicroUmbrellaAppTest

DEC_11 = create_date(2017, 12, 11)
ACCIDENT_CAUSE = 'Crashed'
ACCIDENT_LOCATION = 'Midview City'
INSURANCE_CO = 'AIA'
POLICY_NO = '12345abcde'

DOCUMENTS = {
    'death': ('deathCertificate',
              'repatriationReport',
              'immigrationLetter',
              'relationshipProof')
}


class ClaimTravelTests(MicroUmbrellaAppTest):

    def setUp(self):
        MicroUmbrellaAppTest.setUp(self)

    def choose_policy_to_claim(self, policy_id, accident_type):
        self.login_user()
        self.tap_on(self.poll_accessibility('nav__menu-btn'))
        self.tap_on(self.poll_accessibility('ClaimStack'))

        self.tap_on(self.poll_accessibility('claim__policy-'+policy_id))
        self.tap_on(self.poll_accessibility(
            'chat__choice-item-'+accident_type))

    @timeout(4 * 60)
    def claim_death(self, claimed_insurance):
        accident_type = 'death'
        self.choose_policy_to_claim('TR301694', accident_type)
        self.tap_on(self.poll_accessibility('chat__datepicker'))
        self.select_date(DEC_11)

        self.send_composer_message(ACCIDENT_CAUSE)
        self.send_composer_message(ACCIDENT_LOCATION)

        bool_str = None
        if claimed_insurance:
            bool_str = 'true'
        else:
            bool_str = 'false'

        self.tap_on(self.poll_accessibility('chat__choice-item-'+bool_str))

        if claimed_insurance:
            insurance_co_input = self.poll_accessibility(
                'chat__input-otherInsuranceCo')
            policy_no_input = self.poll_accessibility(
                'chat__input-otherPolicyNo')
            self.tap_on(insurance_co_input)
            sleep(0.5)
            self.driver.set_value(insurance_co_input, INSURANCE_CO)
            self.hide_keyboard()
            sleep(1)
            self.tap_on(policy_no_input)
            sleep(0.5)
            self.driver.set_value(policy_no_input, POLICY_NO)
            self.hide_keyboard()
            sleep(1)
            self.tap_on(self.poll_accessibility('chat__multiinput-send'))

        self.upload_documents(*DOCUMENTS[accident_type])
        sleep(2)
        self.tap_on(self.poll_accessibility('PROCEED'))
        self.tap_on(self.poll_accessibility('OK', 20))

    def test_claim_death_2(self):
        self.claim_death(True)

    # def test_claim_death_1(self):
    #     self.claim_death(False)
