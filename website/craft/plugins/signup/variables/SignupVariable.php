<?php
namespace Craft;

class SignupVariable
{
    public function getUser()
    {
        return craft()->signup->getUser();
    }
}