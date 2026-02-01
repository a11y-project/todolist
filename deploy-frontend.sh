#!/bin/bash

# ===========================================
# Script de déploiement Frontend - TodoList
# Hébergement: o2switch (todolist.accessiproject.fr)
# ===========================================

# Configuration
CPANEL_USER="buke1358"
CPANEL_PASS="f7fT-PVeH-x4t("
CPANEL_HOST="trefle.o2switch.net"
REMOTE_DIR="/home/buke1358/todolist.accessiproject.fr"
LOCAL_CLIENT_DIR="$(dirname "$0")/client"

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Déploiement Frontend TodoList ===${NC}"
echo ""

# Étape 1: Build du frontend
echo -e "${YELLOW}[1/4] Build du frontend React...${NC}"
cd "$LOCAL_CLIENT_DIR" || { echo -e "${RED}Erreur: Dossier client introuvable${NC}"; exit 1; }
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Erreur lors du build${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build terminé${NC}"
echo ""

# Étape 2: Upload index.html
echo -e "${YELLOW}[2/4] Upload index.html...${NC}"
RESPONSE=$(curl -s -k -u "$CPANEL_USER:$CPANEL_PASS" \
    -F "file=@dist/index.html" \
    "https://$CPANEL_HOST:2083/execute/Fileman/upload_files?dir=$REMOTE_DIR&overwrite=1")

if echo "$RESPONSE" | grep -q '"status":1'; then
    echo -e "${GREEN}✓ index.html uploadé${NC}"
else
    echo -e "${RED}Erreur: $RESPONSE${NC}"
    exit 1
fi

# Étape 3: Upload des fichiers CSS
echo -e "${YELLOW}[3/4] Upload des fichiers CSS...${NC}"
for file in dist/assets/*.css; do
    if [ -f "$file" ]; then
        RESPONSE=$(curl -s -k -u "$CPANEL_USER:$CPANEL_PASS" \
            -F "file=@$file" \
            "https://$CPANEL_HOST:2083/execute/Fileman/upload_files?dir=$REMOTE_DIR/assets&overwrite=1")

        if echo "$RESPONSE" | grep -q '"status":1'; then
            echo -e "${GREEN}✓ $(basename "$file") uploadé${NC}"
        else
            echo -e "${RED}Erreur upload CSS: $RESPONSE${NC}"
            exit 1
        fi
    fi
done

# Étape 4: Upload des fichiers JS
echo -e "${YELLOW}[4/4] Upload des fichiers JS...${NC}"
for file in dist/assets/*.js; do
    if [ -f "$file" ]; then
        RESPONSE=$(curl -s -k -u "$CPANEL_USER:$CPANEL_PASS" \
            -F "file=@$file" \
            "https://$CPANEL_HOST:2083/execute/Fileman/upload_files?dir=$REMOTE_DIR/assets&overwrite=1")

        if echo "$RESPONSE" | grep -q '"status":1'; then
            echo -e "${GREEN}✓ $(basename "$file") uploadé${NC}"
        else
            echo -e "${RED}Erreur upload JS: $RESPONSE${NC}"
            exit 1
        fi
    fi
done

echo ""
echo -e "${GREEN}=== Déploiement terminé avec succès ! ===${NC}"
echo -e "URL: ${YELLOW}https://todolist.accessiproject.fr${NC}"
