package org.bodansky.poc.videochat.controller;

/*
 * Created by Adam Bodansky on 2017.06.02..
 */

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;

@Controller
@RequestMapping("/videochat")
public class MainController {

    @Value("${signaling.server.url}")
    private String signalingServerUrl;

    private static final Logger log = LoggerFactory.getLogger(MainController.class);

    @ModelAttribute("signalingServerUrl")
    public String getSignalingServerUrl() {
        return signalingServerUrl;
    }

    @GetMapping("/index")
    public String index() {
        log.info("index() - open index.html");
        return "index";
    }

    @PostMapping("/index")
    public String getRoomName(@PathParam("roomName") String roomName) {
        log.info("getRoomName() {}", roomName);
        return "redirect:/videochat/index/" + roomName;
    }

    @GetMapping("/index/{room}")
    public String getChatRoom(@PathVariable("room") String room, Model model) {
        log.info("getChatRoom() - {}", room);
        model.addAttribute("room", room);
        return "index";
    }
}
