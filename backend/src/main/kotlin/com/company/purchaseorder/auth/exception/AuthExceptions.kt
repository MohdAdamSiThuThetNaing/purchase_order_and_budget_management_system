package com.company.purchaseorder.exception

class InvalidCredentialsException(message: String = "Invalid email or password") : RuntimeException(message)

class InvalidRefreshTokenException(message: String = "Refresh token is invalid or expired") : RuntimeException(message)
