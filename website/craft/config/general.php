<?php

/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here.
 * You can see a list of the default settings in craft/app/etc/config/defaults/general.php
 */

return array(

  '*' => array(
    'omitScriptNameInUrls' => true,
    'imageDriver' => 'imagick'
  ),

  'dev' => array(
    'devMode' => true,
    'environmentVariables' => array(
      'baseUrl' => 'http://reconfigure.dev/'
    ),
    'siteUrl' => 'http://reconfigure.dev/'
  ),

  'staging' => array(
    'devMode' => true,
    'environmentVariables' => array(
      'baseUrl' => 'https://reconfigure.ayup.io/'
    ),
    'siteUrl' => 'https://reconfigure.ayup.io/'
  ),

  'live' => array(
    'environmentVariables' => array(
      'baseUrl' => 'https://reconfigure.io/'
    ),
    'siteUrl' => 'https://reconfigure.io/'
  ),
);
