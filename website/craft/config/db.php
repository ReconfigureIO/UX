<?php

/**
 * Database Configuration
 *
 * All of your system's database configuration settings go in here.
 * You can see a list of the default settings in craft/app/etc/config/defaults/db.php
 */

return array(

	'*' => array(
    'tablePrefix' => 'craft'
  ),

  'dev' => array(
		'server' => 'localhost',
		'user' => 'root',
		'password' => '',
    'database' => 'reconfigure'
  ),

  'staging' => array(
    'server' => 'localhost',
    'user' => 'f40a51e637f7',
	  'password' => '40388d089c4ac2cb',
		'database' => 'reconfigure_stag'
  ),

  'live' => array(
    'server' => 'localhost',
    'user' => 'c7605eea8678',
    'password' => '58f8654e0aeeef3e',
    'database' => 'reconfigure_prod'
  )

);
