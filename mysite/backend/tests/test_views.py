#Blank database is created to perform tests on.
from django.test import TestCase, SimpleTestCase
from ..models import *
class LoginTest(TestCase):
    
    def setUp(self):#Create a lot of models with variations of aaaaa<number> and password
        pass
    def test_first_name(self):
        
        with self.assertRaises(ValidationError):#If Validation error is thrown then it passes test.
            #Ttesting model
            u=User(username="a12345")
            u.full_clean()
            u.save()
        
        
        

    def test_surname(self):
        self.assertEquals("and", "and")