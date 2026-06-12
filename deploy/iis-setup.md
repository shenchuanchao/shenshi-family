# IIS Reverse Proxy Setup Guide

## Prerequisites

- Windows Server with IIS 7.5+ installed
- Administrator access to the server

## Step 1: Install Required IIS Modules

### Install URL Rewrite Module

1. Download from: https://www.iis.net/downloads/microsoft/url-rewrite
2. Run the installer on the server
3. Restart IIS after installation: `iisreset`

### Install Application Request Routing (ARR)

1. Download from: https://www.iis.net/downloads/microsoft/application-request-routing
2. Run the installer on the server
3. Restart IIS after installation: `iisreset`

## Step 2: Enable ARR Proxy

1. Open **IIS Manager**
2. Select the server node in the left pane
3. Double-click **Application Request Routing Cache**
4. Click **Server Proxy Settings** in the right Actions pane
5. Check **Enable proxy**
6. Click **Apply**

## Step 3: Create the Website in IIS

1. In IIS Manager, right-click **Sites** > **Add Website**
2. Configure:
   - **Site name**: `shenshi-culture`
   - **Physical path**: `E:\temp\shenshi-culture\deploy`
   - **Binding**: Type `http`, Host name `shenshi.example.com`, Port `80`
3. Click **OK**

## Step 4: Deploy web.config

1. Copy `deploy/web.config` to the site's physical path (`E:\temp\shenshi-culture\deploy\`)
2. The web.config will be automatically picked up by IIS

## Step 5: Allow Server Variables (Required)

Server variables must be unlocked at the IIS server level before they can be used in `web.config`. Open an **elevated Command Prompt** (Run as Administrator) and run:

```cmd
%windir%\system32\inetsrv\appcmd.exe set config -section:system.webServer/rewrite/allowedServerVariables /+"[name='HTTP_X_FORWARDED_FOR']" /commit:apphost
%windir%\system32\inetsrv\appcmd.exe set config -section:system.webServer/rewrite/allowedServerVariables /+"[name='HTTP_X_FORWARDED_PROTO']" /commit:apphost
%windir%\system32\inetsrv\appcmd.exe set config -section:system.webServer/rewrite/allowedServerVariables /+"[name='HTTP_X_REAL_IP']" /commit:apphost
%windir%\system32\inetsrv\appcmd.exe set config -section:system.webServer/rewrite/allowedServerVariables /+"[name='HTTP_X_FORWARDED_HOST']" /commit:apphost
```

Alternatively, in IIS Manager:
1. Select the **server** node (not the site)
2. Double-click **URL Rewrite**
3. Click **View Server Variables** in the right Actions pane
4. Click **Add** and add each of: `HTTP_X_FORWARDED_FOR`, `HTTP_X_FORWARDED_PROTO`, `HTTP_X_REAL_IP`, `HTTP_X_FORWARDED_HOST`

## Step 6: Install Node.js and PM2 on the Server

```bash
# Install Node.js (use the Windows installer from https://nodejs.org)
# Then install PM2 globally:
npm install -g pm2

# Install windows-startup for PM2 auto-start:
npm install -g pm2-windows-startup
pm2-startup install
```

## Step 7: Start the Application

```bash
cd E:\temp\shenshi-culture
npm install
npm run build
npm run start
pm2 save
```

## Step 8: Verify

1. Open a browser and navigate to `http://shenshi.example.com`
2. You should see the frontend (Next.js on port 3001)
3. Navigate to `http://shenshi.example.com/api/health` to verify backend routing (port 3000)

## Troubleshooting

- **502 Bad Gateway**: Ensure backend/frontend Node.js processes are running (`pm2 list`)
- **Proxy errors**: Check ARR is enabled and proxy settings are correct
- **WebSocket issues**: Verify WebSocket protocol is enabled in ARR settings
- **Server variable errors**: Check that server variables are in the allowed list
- **Logs**: Check `E:\temp\shenshi-culture\logs\` for application logs, and IIS logs at `%SystemDrive%\inetpub\logs\LogFiles`
