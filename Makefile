SHELL = /bin/sh
OPT_DIR = /opt
LIB_DIR = /var/lib

ifeq ($(PREFIX),)
	PREFIX := /usr/local
endif

help:
	@echo "Use one of the following options:"
	@echo "install - Installs salah-compass"
	@echo "uninstall - Uninstalls salah-compass"
	@echo "reinstall - Reinstalls salah-compass"
	@echo "update - Updates salah-compass"

crater-get:
	@echo "Setting up Crater for temporary use..."
	git clone https://github.com/crater-space/cli /tmp/crater-cli

primary-deps:
	@echo "Making sure Node.js is installed..."
ifneq ($(shell command -v node),)
	@echo "Node.js found."
else
	@echo "Node.js not found!"
	@echo "Attempting to install Node.js using Crater..."
	/tmp/crater-cli/crater install nodejs
endif
	@echo "Making sure mpv is installed..."
ifneq ($(shell command -v mpv),)
	@echo "mpv found."
else
	@echo "mpv not found!"
	@echo "Attempting to install mpv using Crater..."
	/tmp/crater-cli/crater install mpv
endif
	@echo "Making sure pipewire is installed..."
ifneq ($(shell command -v pipewire),)
	@echo "pipewire found."
else
	@echo "pipewire not found!"
	@echo "Attempting to install pipewire using Crater..."
	/tmp/crater-cli/crater install pipewire
endif
	@echo "Making sure dbus is installed..."
ifneq ($(shell command -v dbus-run-session),)
	@echo "dbus found."
else
	@echo "dbus not found!"
	@echo "Attempting to install dbus using Crater..."
	/tmp/crater-cli/crater install dbus
endif
	@echo "Making sure caddy is installed..."
ifneq ($(shell command -v caddy),)
	@echo "caddy found."
else
	@echo "caddy not found!"
	@echo "Attempting to install caddy using Crater..."
	/tmp/crater-cli/crater install caddy
endif
	@echo "All required dependencies found."

crater-remove:
	@echo "Removing Crater..."
	rm -rf /tmp/crater-cli

req: crater-get primary-deps crater-remove

place:
	@echo "Installing commands..."
	sudo install ./scripts/* $(PREFIX)/bin/
	sudo mkdir -p $(OPT_DIR)/salah-compass
	sudo chmod -R 755 $(OPT_DIR)/salah-compass
	sudo chown -R $$USER:$$USER $(OPT_DIR)/salah-compass
	mkdir -p $(OPT_DIR)/salah-compass/adhans
	cp -R ./adhans/* $(OPT_DIR)/salah-compass/adhans
	cp -R ./dashboard/web $(OPT_DIR)/salah-compass/dashboard
	sudo mkdir -p $(LIB_DIR)/salah-compass
	sudo chmod -R 755 $(LIB_DIR)/salah-compass
	sudo chown -R $$USER:$$USER $(LIB_DIR)/salah-compass
	@echo "commands installed."

configure:
	@if test -f "$(LIB_DIR)/salah-compass/coordinates"; then \
		echo "Configuration exists!"; \
	else \
		echo "Configuring..."; \
		./scripts/salah-compass-configure; \
	fi

init:
	./scripts/salah-compass-schedule-tasks

service:
	@echo "Looking for a known init system..."
ifneq ($(shell command -v runit),)
	@echo "'Runit' found. Attempting to create a service..."
	sudo cp -R ./dashboard/service/salah-compass-runit /etc/sv/salah-compass
	sudo ln -s /etc/sv/salah-compass /var/service
	@echo "Runit service created and started."
else ifneq ($(shell command -v systemctl),)
	@echo "'SystemD' found. Attempting to create a service..."
	sudo cp ./dashboard/service/salah-compass.service /etc/systemd/system/
	systemctl enable salah-compass.service
	systemctl start salah-compass.service
	@echo "SystemD service created and started."
else
	@echo "No known init system found."
endif

install: req place configure init service
	@echo "salah-compass is now installed."

uninstall:
	@echo "Uninstalling salah-compass..."
	sudo rm $(PREFIX)/bin/salah-compass*
	sudo rm -rf $(OPT_DIR)/salah-compass
	sudo rm -rf $(LIB_DIR)/salah-compass
	sudo crontab -u $$USER -r
ifneq ($(shell command -v runit),)
	sudo rm -rf /var/service/salah-compass
	sudo rm -rf /etc/sv/salah-compass
else ifneq ($(shell command -v systemctl),)
	systemctl stop salah-compass.service
	systemctl disable salah-compass.service
	sudo rm -rf /etc/systemd/system/salah-compass.service
endif
	@echo "salah-compass has been uninstalled."

reinstall: uninstall install

get-latest:
	git pull origin main

update: get-latest reinstall
