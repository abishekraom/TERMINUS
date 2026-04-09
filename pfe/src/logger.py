from __future__ import annotations

import logging
import os
import sys

try:
    from pythonjsonlogger import jsonlogger
except Exception:  # pragma: no cover
    jsonlogger = None


class ServiceFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.service = "pfe"
        return True


def setup_logger(name: str = "pfe") -> logging.Logger:
    logger = logging.getLogger(name)
    if logger.handlers:
        return logger

    level = os.getenv("LOG_LEVEL", "INFO").upper()
    logger.setLevel(level)
    logger.propagate = True

    handler = logging.StreamHandler(sys.stdout)
    if jsonlogger:
        handler.setFormatter(
            jsonlogger.JsonFormatter("%(service)s %(levelname)s %(name)s %(message)s")
        )
    else:  # pragma: no cover
        handler.setFormatter(logging.Formatter("%(service)s %(levelname)s %(message)s"))

    handler.addFilter(ServiceFilter())
    logger.addHandler(handler)
    return logger


LOG = setup_logger()
