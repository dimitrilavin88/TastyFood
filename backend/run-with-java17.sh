#!/bin/bash

# Find Java 17 home
JAVA17_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null)

if [ -z "$JAVA17_HOME" ]; then
  echo "Java 17 not found. Please install Java 17 or adjust the script."
  exit 1
fi

echo "Using Java 17 from: $JAVA17_HOME"

# Run Maven with Java 17
JAVA_HOME=$JAVA17_HOME mvn spring-boot:run
