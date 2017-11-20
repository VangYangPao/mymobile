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


class PurchasePhoneTests(MicroUmbrellaAppTest):

    def setUp(self):
        MicroUmbrellaAppTest.setUp(self)

    def test_purchase_phone_1(self):
        brand = (1, 'apple')
        model = (1, 'iphone 5c')
        return self.purchase_phone_policy(
            brand, model, datetime.datetime.now())

    def test_purchase_phone_2(self):
        brand = (2, 'asus')
        model = (6, 'zenphone 2')
        return self.purchase_phone_policy(
            brand, model, datetime.datetime.now())

    @timeout(2 * 60)
    def purchase_phone_policy(self, brand, model, purchase_date):
        brand_id, brand_name = brand
        model_id, model_name = model

        self.login_user()

        menu_btn = self.poll_accessibility('nav__menu-btn')
        self.assertIsNotNone(menu_btn)
        travel_policy_choice = self.poll_accessibility(
            'purchase__policy-choice-mobile')
        self.tap_on(travel_policy_choice)
        sleep(0.5)
        back_btn = self.find_accessibility('nav__back-btn')
        self.assertIsNotNone(back_btn)
        purchase_btn = self.find_accessibility('policy__purchase-btn')
        self.tap_on(purchase_btn)

        COMPOSER_PLACEHOLDER = 'Type your message here...'
        IMEI_NUMBER = '999999999999999'
        SEND_BUTTON = 'Send'

        back_btn = self.poll_accessibility('nav__back-btn')
        self.assertIsNotNone(back_btn)

        self.tap_on(self.poll_accessibility('chat__action-picker'))
        sleep(1)
        self.tap_on(self.find_accessibility('chat__suggestion-passport'))
        sleep(0.5)
        composer = self.find_accessibility(COMPOSER_PLACEHOLDER)
        self.tap_on(composer)
        self.driver.set_value(composer, str(uuid4())[:14])
        self.tap_on(self.find_accessibility(SEND_BUTTON))
        # sleep(1 * LOAD_TIME_MULTIPLY)

        self.tap_on(self.poll_accessibility(COMPOSER_PLACEHOLDER))
        sleep(1)
        self.driver.set_value(composer, IMEI_NUMBER)
        self.tap_on(self.find_accessibility(SEND_BUTTON))

        self.tap_on(self.poll_accessibility(COMPOSER_PLACEHOLDER))
        sleep(0.5)
        self.driver.set_value(composer, brand_name)
        self.tap_on(self.poll_accessibility('chat__suggestion-'+str(brand_id)))

        self.tap_on(self.poll_accessibility(COMPOSER_PLACEHOLDER))
        sleep(0.5)
        self.driver.set_value(composer, model_name)
        self.tap_on(self.poll_accessibility('chat__suggestion-'+str(model_id)))

        self.tap_on(self.poll_accessibility('chat__datepicker'))
        sleep(1)
        self.select_date(datetime.datetime.now())

        self.do_checkout()
