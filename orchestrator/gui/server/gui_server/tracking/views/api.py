# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes((permissions.AllowAny,))
def api_root(request):
    """
    Logging root
    """
    rtn = dict(
        message="Hello, {}. You're at the logs api index.".format(request.user.username),
    )

    return Response(rtn)
