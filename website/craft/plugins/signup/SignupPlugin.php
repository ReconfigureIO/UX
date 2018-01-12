<?php
namespace Craft;

class SignupPlugin extends BasePlugin
{
    function init()
    {
      
    }

    function getName()
    {
         return Craft::t('Signup');
    }

    function getVersion()
    {
        return '1.0';
    }

    function getDeveloper()
    {
        return 'Ayup';
    }

    function getDeveloperUrl()
    {
        return 'http://ayup.agency';
    }

    public function hasCpSection()
    {
        return false;
    }

    /**
     * @return mixed
     */
    public function getSettingsHtml()
    {

    }

}
