<?php

// phpcs:disable WordPress.PHP.DiscouragedPHPFunctions.system_calls_shell_exec
// phpcs:disable WordPress.WP.AlternativeFunctions.json_encode_json_encode


declare(strict_types = 1);

echo 'Copying files to build directory' . PHP_EOL;

// Remove the build directory if it exists.
shell_exec( 'rm -rf build' );

// Create the build directory where we will copy the files for the zip.
shell_exec( 'mkdir -p build/assets' );

// Copy the files to the build directory.
shell_exec( 'cp -r assets/dist build/assets' );
shell_exec( 'cp -r includes build/includes' );
shell_exec( 'cp -r languages build/languages' );
shell_exec( 'cp css-class-manager.php build' );
shell_exec( 'cp index.php build' );
shell_exec( 'cp LICENSE build' );
shell_exec( 'cp readme.txt build' );

// WP CLI commands to read composer.json, remove `repositories`, `require-dev`
// and `config` property and write it to build/composer.json file.
// This is needed to avoid requiring GitHub token for repositories.
echo 'Copying composer.json to build directory' . PHP_EOL;
$json = json_decode( file_get_contents( 'composer.json' ), true );
unset( $json['repositories'] );
unset( $json['require-dev'] );
unset( $json['config'] );
// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.file_ops_file_put_contents
file_put_contents(
	'build/composer.json',
	json_encode( $json )
);

// Run composer install command.
shell_exec( 'composer install --working-dir=build/' );
shell_exec( 'composer dump -o --working-dir=build/' );
shell_exec( 'rm build/composer.lock' );

// Directory to zip.
$source_dir = __DIR__ . '/build/';

// Name of the zip file to create.
$zip_file = 'css-class-manager.zip';

// Initialize ZipArchive object.
$zip = new ZipArchive();

// Create the zip file.
if ( $zip->open( $zip_file, ZipArchive::CREATE | ZipArchive::OVERWRITE ) === true ) {
	// Create recursive directory iterator.
	$files = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator( $source_dir ),
		RecursiveIteratorIterator::LEAVES_ONLY
	);

	// Iterate through each file and add it to the zip.
	foreach ( $files as $file ) {
		// Skip directories (they are added automatically).
		if ( $file->isDir() ) {
			continue;
		}

		$file_path = $file->getRealPath();
		// Add file to zip with relative path.
		$relative_path = substr( $file_path, strlen( $source_dir ) );
		$zip->addFile( $file_path, 'css-class-manager/' . $relative_path );
	}

	// Close zip.
	$zip->close();

	echo 'Zip file created successfully!' . PHP_EOL;
} else {
	echo 'Failed to create zip file!' . PHP_EOL;
}

// Remove the build directory after creating the zip.
shell_exec( 'rm -rf build' );
echo 'Removed build directory' . PHP_EOL;
