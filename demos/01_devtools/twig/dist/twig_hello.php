<?php

	// includes & requires
	require_once __DIR__ . '/../vendor/autoload.php';

	// Twig Bootstrap
	$loader = new Twig_Loader_Filesystem(__DIR__ . '/../src/views');
	$twig = new Twig_Environment($loader, array(
		'cache' => __DIR__ . '/cache',
		'auto_reload' => true // set to false on production
	));

	// data
	$user = array(
		'firstname' => 'Rogier',
		'lastname' => 'van der Linde',
	);

	// load template
	$tpl = $twig->loadTemplate('twig_hello.twig');

	// render template with our data
	echo $tpl->render(array(
		'user' => $user
	));

// EOF