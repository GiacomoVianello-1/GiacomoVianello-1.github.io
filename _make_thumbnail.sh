#!/bin/bash
# Crea la cartella di destinazione se non esiste
mkdir -p tn/images

for file in images/*.{jpg,png,gif}; do
    if [ ! -f "tn/$file" ]; then
        if [[ "$file" == *.gif ]]; then
            # Per le GIF: ridimensiona mantenendo l'animazione e ottimizzando
            convert "$file" -coalesce -thumbnail 300x300^ -layers optimize "tn/$file"
        else
            # Per JPG e PNG
            convert "$file" -thumbnail 300x300 "tn/$file"
        fi
    fi
done