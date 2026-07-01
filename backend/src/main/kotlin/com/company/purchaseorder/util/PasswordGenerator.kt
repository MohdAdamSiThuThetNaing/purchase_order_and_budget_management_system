package com.company.purchaseorder.util

import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

@Component
class PasswordPrinter : CommandLineRunner {

    override fun run(vararg args: String?) {
        println("====================================")
        println(BCryptPasswordEncoder().encode("Password123!"))
        println("====================================")
    }
}