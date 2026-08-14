<?php

namespace App\Domain\Client;

enum ClientStatus: string
{
    case Active = 'active';
    case Inactive = 'inactive';
}
