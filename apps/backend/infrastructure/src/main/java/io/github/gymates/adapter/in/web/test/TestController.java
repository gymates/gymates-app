package io.github.gymates.adapter.in.web.test;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/home")
    public String homePage() {
        return "YAY";
    }
}
