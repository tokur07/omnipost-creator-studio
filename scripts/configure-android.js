const fs = require('fs');
const path = require('path');

// 1. Konfigurasi AndroidManifest.xml untuk izin Galeri, Internet & Package Visibility Sosmed
const manifestPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
if (fs.existsSync(manifestPath)) {
  let manifest = fs.readFileSync(manifestPath, 'utf8');

  const permissions = [
    '<uses-permission android:name="android.permission.INTERNET" />',
    '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />',
    '<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />',
    '<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" />',
    '<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />',
    '<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />',
    '<uses-permission android:name="android.permission.CAMERA" />'
  ];

  permissions.forEach((perm) => {
    if (!manifest.includes(perm)) {
      manifest = manifest.replace('<application', `${perm}\n    <application`);
    }
  });

  if (!manifest.includes('android:usesCleartextTraffic')) {
    manifest = manifest.replace(
      '<application',
      '<application android:usesCleartextTraffic="true" android:requestLegacyExternalStorage="true"'
    );
  }

  const queriesBlock = `
    <queries>
        <package android:name="com.instagram.barcelona" />
        <package android:name="com.instagram.android" />
        <package android:name="com.zhiliaoapp.musically" />
        <package android:name="com.ss.android.ugc.trill" />
        <package android:name="com.twitter.android" />
        <package android:name="com.google.android.youtube" />
        <package android:name="com.facebook.katana" />
        <package android:name="com.linkedin.android" />
    </queries>
`;

  if (!manifest.includes('<queries>')) {
    manifest = manifest.replace('</manifest>', `${queriesBlock}</manifest>`);
  }

  fs.writeFileSync(manifestPath, manifest, 'utf8');
  console.log('AndroidManifest.xml berhasil dikonfigurasi.');
}

// 2. Konfigurasi Signing Release di android/app/build.gradle
const buildGradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');
if (fs.existsSync(buildGradlePath)) {
  let gradle = fs.readFileSync(buildGradlePath, 'utf8');

  const signingBlock = `    signingConfigs {
        release {
            storeFile file("release-key.jks")
            storePassword System.getenv("KEYSTORE_PASSWORD") ?: "omnipost2026"
            keyAlias System.getenv("KEY_ALIAS") ?: "omnipost"
            keyPassword System.getenv("KEY_PASSWORD") ?: "omnipost2026"
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release`;

  if (!gradle.includes('signingConfigs')) {
    gradle = gradle.replace(/buildTypes\s*\{\s*release\s*\{/, signingBlock);
  }

  fs.writeFileSync(buildGradlePath, gradle, 'utf8');
  console.log('build.gradle berhasil dikonfigurasi.');
}
