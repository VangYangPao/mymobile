import os
import sys
import logging
import unittest
from appium import webdriver
import datetime
from datetime import date as create_date
from datetime import timedelta
from timeout_decorator import timeout
from time import sleep
from uuid import uuid4
from dateutil.relativedelta import relativedelta

from mu_tests import MicroUmbrellaAppTest

test_dir = os.path.dirname(os.path.realpath(__file__))
root_dir = os.path.abspath(os.path.join(test_dir, os.pardir))

current_cap = {}

LOGIN_EMAIL = 'x@aa.com'
LOGIN_PASSWORD = '1234abcd'

if __name__ == '__main__':
    build_type = sys.argv[1]

    if (build_type != 'release' and build_type != 'debug'):
        sys.exit()

    apk_type = 'app-debug.apk'
    if build_type == 'release':
        apk_type = 'app-release.apk'

    ipa_type = 'Debug-iphonesimulator'
    if build_type == 'release':
        ipa_type = 'Release-iphonesimulator'

    android_app_path = os.path.join(
        root_dir, 'android', 'app', 'build', 'outputs', 'apk', apk_type)
    ios_app_path = os.path.join(root_dir, 'ios', 'build', 'Build',
                                'Products', ipa_type,
                                'Microsurance.app')

    local_caps = {
        # 'android': {
        #     'platformName': 'Android',
        #     'platformVersion': '7.0',
        #     'deviceName': 'Redmi',
        #     'app': android_app_path
        # },
        # 'android': {
        #     'platformName': 'Android',
        #     'platformVersion': '6.0',
        #     'deviceName': 'Redmi',
        #     'app': android_app_path
        # },
        'iPhone 5s': {
            'platformName': 'iOS',
            'platformVersion': '10.3',
            'deviceName': 'iPhone 5s',
            'app': ios_app_path
        }
    }

    build_type = sys.argv[1]
    LOCAL_TIMEOUT = 10
    LOAD_TIME_MULTIPLY = 2
    if build_type == 'debug':
        LOAD_TIME_MULTIPLY = 1

MALE_OPTION = 1
FEMALE_OPTION = 2

SPOUSE_OPTION = 1
CHILD_OPTION = 2

AREAS = {
    1: (55, 'Malaysia'),
    2: (53, 'Macau'),
    3: (58, 'Mexico')
}


def get_birth_date(age):
    now = datetime.datetime.now()
    birth_date = now - relativedelta(years=age)
    return birth_date

SPOUSE = {
    'dob': get_birth_date(30),
    'relationship': SPOUSE_OPTION
}
CHILD = {
    'dob': get_birth_date(1),
    'relationship': CHILD_OPTION
}


class PurchaseTravelTests(MicroUmbrellaAppTest):

    def setUp(self):
        self.driver = webdriver.Remote(
            'http://localhost:4723/wd/hub', current_cap)

    def add_traveller(self, traveller):
        self.tap_on(self.poll_accessibility('purchase__add-traveller'))
        first_name_input = self.poll_accessibility('table__field-firstName')
        self.tap_on(first_name_input)
        self.driver.set_value(first_name_input, 'Ken')
        self.hide_keyboard()
        last_name_input = self.find_accessibility('table__field-lastName')
        self.tap_on(last_name_input)
        self.driver.set_value(last_name_input, 'Chan')
        self.hide_keyboard()
        nric_input = self.find_accessibility('table__field-idNumber')
        self.tap_on(nric_input)
        self.driver.set_value(nric_input, '999')
        self.hide_keyboard()
        dob_input = self.find_accessibility('table__field-DOB')
        self.tap_on(dob_input)
        sleep(2)
        self.select_date(traveller['dob'])
        self.tap_on(self.poll_accessibility('table__field-gender'))
        self.tap_on(self.poll_accessibility(
            'picker__option-'+str(MALE_OPTION)))
        self.tap_on(self.poll_accessibility('table__field-relationship'))
        self.tap_on(self.poll_accessibility(
            'picker__option-'+str(traveller['relationship'])))
        self.tap_on(self.find_accessibility('table__save-btn'))

    def test_purchase_travel_applicant_1(self):
        self.purchase_travel_policy(
            travel_area=2,
            start_date=create_date(2017, 12, 10),
            duration=17, plan='enhanced', spouse=SPOUSE)

    def test_purchase_travel_applicant_2(self):
        return self.purchase_travel_policy(
            travel_area=3,
            start_date=create_date(2017, 12, 10),
            duration=61, plan='superior', spouse=SPOUSE)

    def test_purchase_travel_applicant_3(self):
        return self.purchase_travel_policy(
            travel_area=1,
            start_date=create_date(2017, 12, 10),
            duration=5, plan='basic', spouse=SPOUSE, child=CHILD)

    def test_purchase_travel_applicant_4(self):
        return self.purchase_travel_policy(
            travel_area=3,
            start_date=create_date(2017, 12, 10),
            duration=61, plan='superior', spouse=SPOUSE)

    def test_purchase_travel_applicant_5(self):
        return self.purchase_travel_policy(
            travel_area=3,
            start_date=create_date(2017, 12, 10),
            duration=30, plan='basic', child=CHILD)

    def test_purchase_travel_applicant_6(self):
        return self.purchase_travel_policy(
            travel_area=2,
            start_date=create_date(2017, 12, 10),
            duration=9, plan='superior', spouse=SPOUSE, child=CHILD)

    def test_purchase_travel_applicant_7(self):
        return self.purchase_travel_policy(
            travel_area=3,
            start_date=create_date(2017, 12, 10),
            duration=35, plan='basic')

    def test_purchase_travel_applicant_8(self):
        return self.purchase_travel_policy(
            travel_area=1,
            start_date=create_date(2017, 12, 10),
            duration=24, plan='superior', spouse={
                'dob': get_birth_date(75),
                'relationship': SPOUSE_OPTION
            })

    def test_purchase_travel_applicant_9(self):
        return self.purchase_travel_policy(
            travel_area=3,
            start_date=create_date(2017, 12, 10),
            duration=183, plan='superior')

    def test_purchase_travel_applicant_10(self):
        return self.purchase_travel_policy(
            travel_area=2,
            start_date=create_date(2017, 12, 10),
            duration=6, plan='superior', child={
                'dob': get_birth_date(0.1),
                'relationship': CHILD_OPTION
            })

    def test_purchase_travel_applicant_11(self):
        return self.purchase_travel_policy(
            travel_area=2,
            start_date=create_date(2017, 12, 10),
            duration=6, plan='superior', child={
                'dob': get_birth_date(19),
                'relationship': CHILD_OPTION
            })

    @timeout(4 * 60)
    def purchase_travel_policy(
            self, travel_area,
            start_date, duration, plan, spouse=None, child=None):
        country_code, country_name = AREAS[travel_area]
        signin_el = self.poll_accessibility('intro__sign-in')
        # signin_el = self.find_accessibility('intro__sign-in')
        self.tap_on(signin_el)
        self.login_user()
        # sleep(2)

        menu_btn = self.poll_accessibility('nav__menu-btn')
        self.assertIsNotNone(menu_btn)
        travel_policy_choice = self.poll_accessibility(
            'purchase__policy-choice-travel')
        self.tap_on(travel_policy_choice)
        sleep(0.5)
        back_btn = self.find_accessibility('nav__back-btn')
        self.assertIsNotNone(back_btn)
        purchase_btn = self.find_accessibility('policy__purchase-btn')
        self.tap_on(purchase_btn)
        # sleep(3)
        COMPOSER_PLACEHOLDER = 'Type your message here...'
        back_btn = self.poll_accessibility('nav__back-btn')
        self.assertIsNotNone(back_btn)

        self.tap_on(self.poll_accessibility(plan.upper()+'\nPLAN'))
        self.tap_on(self.poll_accessibility('chat__select-plan_'+plan))
        composer = self.poll_accessibility(COMPOSER_PLACEHOLDER)
        self.tap_on(composer)
        self.driver.set_value(composer, country_name)
        sleep(0.5)
        country_suggestion = self.find_accessibility(
            'chat__suggestion-'+str(country_code))
        self.tap_on(country_suggestion)
        # self.add_traveller(spouse)

        self.tap_on(self.poll_accessibility('chat__datepicker'))
        self.select_date(start_date)
        self.tap_on(self.poll_accessibility('chat__datepicker'))
        self.select_date(start_date + timedelta(days=duration+1))
        # sleep(1.5 * LOAD_TIME_MULTIPLY)

        self.tap_on(self.poll_accessibility('chat__action-picker'))
        sleep(1)
        self.tap_on(self.find_accessibility('chat__suggestion-passport'))
        sleep(0.5)
        composer = self.find_accessibility(COMPOSER_PLACEHOLDER)
        self.tap_on(composer)
        self.driver.set_value(composer, str(uuid4())[:15])
        self.tap_on(self.find_accessibility('Send'))
        # sleep(1 * LOAD_TIME_MULTIPLY)

        # add traveller
        if spouse:
            self.add_traveller(spouse)
        if child:
            self.add_traveller(child)
        self.tap_on(self.poll_accessibility('chat__submit-traveller'))

        sleep(4)
        self.do_checkout()


if __name__ == '__main__':
    for cap in local_caps:
        current_cap = local_caps[cap]
        logging.basicConfig(stream=sys.stderr)
        logging.getLogger("PurchaseTravelTests").setLevel(logging.DEBUG)
        suite = unittest.TestLoader()\
            .loadTestsFromTestCase(PurchaseTravelTests)
        unittest.TextTestRunner(verbosity=2).run(suite)
