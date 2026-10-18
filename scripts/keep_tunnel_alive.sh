#!/usr/bin/env bash
while true; do
  echo "[$(date)] Starting tunnel..."
  ssh -o ServerAliveInterval=15 -o ServerAliveCountMax=4 -o StrictHostKeyChecking=no -R 80:localhost:3000 nokey@localhost.run 2>&1 | while IFS= read -r line; do
    echo "$line"
    if [[ "$line" =~ tunneled\ with\ tls\ termination,\ (https://[a-zA-Z0-9.-]+\.lhr\.life) ]]; then
      echo "${BASH_REMATCH[1]}" > docs/tunnel_url.txt
      echo "[$(date)] Recorded active URL: ${BASH_REMATCH[1]}"
    fi
  done
  sleep 3
done
