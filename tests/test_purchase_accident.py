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


def get_birth_date(age):
    now = datetime.datetime.now()
    birth_date = now - relativedelta(years=age)
    return birth_date

OCCUPATION = (38, 'Computer Programmer')

PA_PLAN_MAPPING = {
    'basic': 101,
    'enhanced': 102,
    'superior': 103,
    'premium': 104
}


class PurchaseAccidentTests(MicroUmbrellaAppTest):

    def setUp(self):
        MicroUmbrellaAppTest.setUp(self)

    def test_purchase_accident_1(self):
        self.purchase_accident_policy('basic', 'pa', '1m', OCCUPATION)

    def test_purchase_accident_2(self):
        self.purchase_accident_policy('enhanced', 'pa', '3m', OCCUPATION)

    def test_purchase_accident_3(self):
        self.purchase_accident_policy('superior', 'pa', '6m', OCCUPATION)

    def test_purchase_accident_4(self):
        self.purchase_accident_policy('premium', 'pa', '12m', OCCUPATION)

    def test_purchase_accident_5(self):
        self.purchase_accident_policy('basic', 'pa_mr', '1m', OCCUPATION)

    def test_purchase_accident_6(self):
        self.purchase_accident_policy('basic', 'pa_wi', '3m', OCCUPATION)

    def test_purchase_accident_7(self):
        invalid_occupation = (38, 'Computer Programmer')
        self.purchase_accident_policy(
            'basic', 'pa', '1m', invalid_occupation)

    @timeout(2 * 60)
    def purchase_accident_policy(
            self, plan, option, duration,
            occupation):
        occupation_code, occupation_name = occupation
        self.login_user()
        # sleep(2)

        # menu_btn = self.poll_accessibility('nav__menu-btn')
        # self.assertIsNotNone(menu_btn)
        travel_policy_choice = self.poll_accessibility(
            'purchase__policy-choice-'+option)
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

        plan_id = str(PA_PLAN_MAPPING[plan])
        self.tap_on(self.poll_accessibility(plan.upper()+'\nPLAN'))
        self.tap_on(self.poll_accessibility('chat__select-plan_'+plan_id))

        self.tap_on(self.poll_accessibility(duration))
        self.tap_on(self.poll_accessibility('CONFIRM DURATION'))

        self.tap_on(self.poll_accessibility('chat__action-picker'))
        sleep(1)
        self.tap_on(self.find_accessibility('chat__suggestion-passport'))
        sleep(0.5)
        composer = self.find_accessibility(COMPOSER_PLACEHOLDER)
        self.tap_on(composer)
        self.driver.set_value(composer, str(uuid4())[:14])
        self.tap_on(self.find_accessibility('Send'))
        # sleep(1 * LOAD_TIME_MULTIPLY)

        self.tap_on(self.poll_accessibility(COMPOSER_PLACEHOLDER))
        self.driver.set_value(composer, occupation_name)
        sleep(1)
        self.tap_on(self.poll_accessibility(
            'chat__suggestion-'+str(occupation_code)))

        self.do_checkout()
