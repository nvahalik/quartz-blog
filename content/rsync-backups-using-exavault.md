---
title: "Rsync Backups Using ExaVault"
date: "2008-07-21"
tags:
draft:
---

When I started [Netoteric](http://netoteric.com/,) I wanted to do everything "my way" (aka better than everyone else).  As altruistic as it sounds, it's much tougher to do in practice.  One of the big things I've had an issue with is handling backups.  For over a year, we've been doing disk-to-disk backups inside our servers.  This is great for restoring an accidently deleted file, but if something else crazy happens, we're SOL.  Enter [ExaVault](http://www.exavault.com/.)

I found ExaVault while looking for rsync providers online.  They do a lot of FTP stuff but they've added [rsync/Linux Backup with ssh, rsync, and sftp support](http://www.exavault.com/rsync-remote-backup.php.)  Not shabby.  All plans come with unlimited bandwidth (with a note that you are required to do incremental backups after the initial first backup).  I'm on the 25 GB plan for $15/mo.  The sign-up is not instant, but I got my information within a few hours.

Their setup information was a little hard to find.  After going through there site though, I was able to find the [rsync setup page](http://www.exavault.com/support-rsync-setup-unix-linux-bsd.php) after going to the Support page.  It walks you through creating the SSH keys for public-key authentication and a few simple rsync commands.

So far, they seem fast, and the price is better than other rsync providers as well.  I'm going to give them a shot for a while and will post a follow-up later on.
