package com.example.backend.security.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
  // Assuming UserRepository is injected here to find the user by username
  // @Autowired
  // UserRepository userRepository;

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    // Dummy implementation
    // User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
    if (!"admin".equals(username)) {
        throw new UsernameNotFoundException("User Not Found with username: " + username);
    }
    
    return new UserDetailsImpl(
        1L, 
        "admin", 
        "admin@example.com", 
        "encoded_password", // You would return the actual password here
        new ArrayList<>() // Authorities
    );
  }
}
