import random
import time

import openai

from src.core.exception import OpenAIRateLimitError


def retry_with_exponential_backoff(
        func,
        initial_delay: float = 0.012,  # 60/5000 = 0.012
        exponential_base: float = 1.5,
        jitter: bool = True,
        max_retries: int = 20,
        errors: tuple = (openai.RateLimitError,),
):
    """Retry a function with exponential backoff."""

    def wrapper(*args, **kwargs):
        # Initialize variables
        num_retries = 0
        delay = initial_delay

        # Loop until a successful response or max_retries is hit or an exception is raised
        while True:
            try:
                return func(*args, **kwargs)

            # Retry on specific errors
            except errors as e:
                # Increment retries
                num_retries += 1

                # Check if max retries has been reached
                if num_retries > max_retries:
                    raise OpenAIRateLimitError

                # print(f"Retry {num_retries}/{max_retries} after error: {e}")
                # print(f"Next delay: {delay:.4f} seconds")

                # Sleep for the delay
                time.sleep(delay)

                # Increment the delay
                delay *= exponential_base * (1 + jitter * random.random())

    return wrapper
