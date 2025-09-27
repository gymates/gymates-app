#!/usr/bin/env sh
if [ -z "$husky_skip_init" ]; then
  readonly husky_skip_init=1
  export husky_skip_init
  sh -e "$0" "$@"
  exit $?
fi

if [ -z "$husky_skip_init" ]; then
  readonly husky_skip_init=1
  export husky_skip_init
  sh -e "$0" "$@"
  exit $?
fi

# Shell autocompletion options picked by accident.
unset -f command_not_found_handle 2>/dev/null
unset -f _python_argcomplete 2>/dev/null

husky_use_hooks=1
export husky_use_hooks
