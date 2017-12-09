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
    'DOB': get_birth_date(30),
    'relationship': SPOUSE_OPTION
}
CHILD = {
    'DOB': get_birth_date(1),
    'relationship': CHILD_OPTION
}


class PurchaseTravelTests(MicroUmbrellaAppTest):

    def setUp(self):
        MicroUmbrellaAppTest.setUp(self)

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
        with open('source.txt', 'w') as f:
            f.write(self.driver.page_source)
        self.tap_on(self.find_accessibility('table__field-DOB'))
        sleep(2)
        self.select_date(traveller['DOB'])
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

    # def test_purchase_travel_applicant_2(self):
    #     return self.purchase_travel_policy(
    #         travel_area=3,
    #         start_date=create_date(2017, 12, 10),
    #         duration=61, plan='superior', spouse=SPOUSE)

    # def test_purchase_travel_applicant_3(self):
    #     return self.purchase_travel_policy(
    #         travel_area=1,
    #         start_date=create_date(2017, 12, 10),
    #         duration=5, plan='basic', spouse=SPOUSE, child=CHILD)

    # def test_purchase_travel_applicant_4(self):
    #     return self.purchase_travel_policy(
    #         travel_area=3,
    #         start_date=create_date(2017, 12, 10),
    #         duration=61, plan='superior', spouse=SPOUSE)

    # def test_purchase_travel_applicant_5(self):
    #     return self.purchase_travel_policy(
    #         travel_area=3,
    #         start_date=create_date(2017, 12, 10),
    #         duration=30, plan='basic', child=CHILD)

    # def test_purchase_travel_applicant_6(self):
    #     return self.purchase_travel_policy(
    #         travel_area=2,
    #         start_date=create_date(2017, 12, 10),
    #         duration=9, plan='superior', spouse=SPOUSE, child=CHILD)

    # def test_purchase_travel_applicant_7(self):
    #     return self.purchase_travel_policy(
    #         travel_area=3,
    #         start_date=create_date(2017, 12, 10),
    #         duration=35, plan='basic')

    # def test_purchase_travel_applicant_8(self):
    #     return self.purchase_travel_policy(
    #         travel_area=1,
    #         start_date=create_date(2017, 12, 10),
    #         duration=24, plan='superior', spouse={
    #             'dob': get_birth_date(75),
    #             'relationship': SPOUSE_OPTION
    #         })

    # def test_purchase_travel_applicant_9(self):
    #     return self.purchase_travel_policy(
    #         travel_area=3,
    #         start_date=create_date(2017, 12, 10),
    #         duration=183, plan='superior')

    # def test_purchase_travel_applicant_10(self):
    #     return self.purchase_travel_policy(
    #         travel_area=2,
    #         start_date=create_date(2017, 12, 10),
    #         duration=6, plan='superior', child={
    #             'dob': get_birth_date(0.1),
    #             'relationship': CHILD_OPTION
    #         })

    # def test_purchase_travel_applicant_11(self):
    #     return self.purchase_travel_policy(
    #         travel_area=2,
    #         start_date=create_date(2017, 12, 10),
    #         duration=6, plan='superior', child={
    #             'dob': get_birth_date(19),
    #             'relationship': CHILD_OPTION
    #         })

    @timeout(4 * 60)
    def purchase_travel_policy(
            self, travel_area,
            start_date, duration, plan, spouse=None, child=None):
        country_code, country_name = AREAS[travel_area]
        self.login_user()
        # sleep(2)

        # menu_btn = self.poll_accessibility('nav__menu-btn')
        # self.assertIsNotNone(menu_btn)
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

        self.tap_on(self.poll_accessibility(plan.upper()+' PLAN'))
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
        self.select_date(start_date + timedelta(days=duration+1), start_date)
        # sleep(1.5 * LOAD_TIME_MULTIPLY)

        # self.tap_on(self.poll_accessibility('chat__action-picker'))
        # sleep(1)
        self.tap_on(self.poll_accessibility('chat__suggestion-passport'))
        sleep(0.5)
        composer = self.poll_accessibility(COMPOSER_PLACEHOLDER)
        self.tap_on(composer)
        self.driver.set_value(composer, str(uuid4())[:14])
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
