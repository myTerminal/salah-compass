# salah-compass

[![License](https://img.shields.io/github/license/myTerminal/salah-compass.svg)](https://opensource.org/licenses/MIT)  
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Y8Y5E5GL7)

An automated prayer call alarm system and dashboard for UNIX-like systems

> Note: This is an alpha-quality software and is expected to change with time. In its current state, the implementation works on my test hardware and software. As I expand support on a wider combination of systems, your contributions to help me make it useful for more people will be highly appreciated.

## Requirements

### Hardware

You can run this on any hardware that can run Linux or other UNIX-like systems.

### Software

*salah-compass* should run on almost all UNIX-like operating systems. It also needs the following additional dependencies, all of which it attempts to install during setup:

 - [Node.js](https://nodejs.org)
 - [mpv](https://mpv.io)
 - [PipeWire](https://pipewire.org)
 - [dbus](https://www.freedesktop.org/wiki/Software/dbus)
 - [caddy](https://caddyserver.com)

## Installation

There are a few different ways to get *salah-compass*.

### Compile from source

    # Clone project to the local workspace
    git clone https://github.com/myTerminal/salah-compass.git

    # Switch to the project directory
    cd salah-compass

    # Install with `make`
    make install

### Automatic installation

Simply execute the below command in a terminal; the rest should be automatic.

    /bin/bash -c "$(curl https://raw.githubusercontent.com/myTerminal/salah-compass/main/install)"

### Through a package manager

*salah-compass* will soon be available to install from your operating system's package manager.

## How to Use

Once installed, *salah-compass* works automatically:

1. It fetches the prayer timings for the day once at the start of the day and sets prayer call reminders as cron jobs.
2. At the prayer times according to its knowledge, it plays an audio version of the appropriate Adhan for the time.
3. A live, web-based dashboard showing the map of the entire day covering all five obligatory prayers (and more) is made available on port 7086.

The following parameters have been hard-coded for the time being and will be made configurable if needed:

1. **Prayer time calculation method** has been set to "Islamic Society of North America"
2. **School** has been set to "Hanafi"

**Note:** As *salah-compass* works with `cron` jobs, it is suggested to be run for a non-organic user dedicated specifically for this purpose.

    useradd muezzin -m
    passwd muezzin
    usermod -aG wheel,audio,video,optical,storage muezzin

Using a dedicated user would make sure it won't conflict with `cron` jobs for other users.

### Configuring for your location (automatic)

    salah-compass-configure

The above command prompts the user for geographical coordinates for Adhan reminders.

### Setting alarms for the current day (automatic)

    salah-compass-schedule-tasks

The above command schedules Adhan reminders, and a few other tasks.

## Updating

In order to update *salah-compass*, simply run:

    salah-compass-update

## Uninstalling

In order to uninstall *salah-compass*, simply run:

    salah-compass-uninstall

## To-Do

- Remove dependency on `pipewire` and `dbus`
- Allow configuration beyond the location
