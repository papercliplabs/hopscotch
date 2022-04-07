tell application "iTerm"
  tell current window
    create tab with profile "Solarized Dark Fixed"
  end tell

  tell first session of current tab of current window
    set name to "API SERVER"
    write text "cd hasura/"
    write text "docker-compose up"

    split vertically with profile "Solarized Dark Fixed"
    split horizontally with profile "Solarized Dark Fixed"
    split horizontally with profile "Solarized Dark Fixed"
  end tell

  tell second session of current tab of current window
    set name to "CLIENT"
    delay 3
    write text "yarn dev"
  end tell

  tell third session of current tab of current window
      set name to "Console"
      write text "cd hasura/"
      delay 3
      write text "hasura console --admin-secret=squidsquidsquid"
  end

  tell fourth session of current tab of current window
    set name to "MAIN TERM"
    delay 3
    write text "code ."
  end
end tell
