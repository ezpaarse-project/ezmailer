SCRIPT_DIR=$(dirname "${BASH_SOURCE[0]}")
LOCAL_ENV_FILE="$SCRIPT_DIR/config.local.env.sh"

export NODE_ENV="production"
export EZMAILER_PORT=3000
export EZMAILER_SMTP_HOST="localhost"
export EZMAILER_SMTP_HOST=25

if [[ -f $LOCAL_ENV_FILE ]] ; then
  source "$LOCAL_ENV_FILE"
fi