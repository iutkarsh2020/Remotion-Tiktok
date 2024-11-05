#!/bin/bash
#This is the source directory
source "$(dirname "$0")/config.sh"
echo $name


echo "Checking for ffmpeg"
# Install ffmpeg if not it is not already installed
if ! command -v ffmpeg &> /dev/null; then
    echo "ffmpeg not found, installing..."
    # Check for macOS or Ubuntu and install accordingly
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # Install ffmpeg on macOS using Homebrew
        if command -v brew &> /dev/null; then
            brew install ffmpeg
        else
            echo "Homebrew not found. Please install Homebrew and try again."
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Install ffmpeg on Ubuntu
        sudo apt update
        sudo apt install -y ffmpeg
    else
        echo "Unsupported OS. Please install ffmpeg manually."
        exit 1
    fi
else
    echo "ffmpeg is already installed."
fi

# Calculate duration of the video we want
START_SECONDS=$(date -j -f "%H:%M:%S" "$START_TIME" +"%s")
END_SECONDS=$(date -j -f "%H:%M:%S" "$END_TIME" +"%s")

DURATION=$((END_SECONDS - START_SECONDS))
echo "Duration of the Video = $DURATION seconds"

# Run ffmpeg command to clip video
ffmpeg -i "$INPUT_VIDEO" -ss "$START_TIME" -t "$DURATION" -c copy "$OUTPUT_VIDEO"

echo "Clipped video saved as $OUTPUT_VIDEO"
cd ..
echo $(pwd)

echo "****** Creating Captions ******"
node sub.mjs

echo "****** Building Video at OUT DIRECTORY ******"
npm run build

echo "******CHECK OUT DIRECTORY******"
