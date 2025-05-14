
<?php
echo "Building React application...\n";

// Run npm build
$output = shell_exec('npm run build');
echo $output;

echo "Build completed. Files are in the dist directory.\n";
?>
