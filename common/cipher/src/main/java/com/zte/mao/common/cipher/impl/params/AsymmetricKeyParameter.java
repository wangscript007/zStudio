package com.zte.mao.common.cipher.impl.params;

import com.zte.mao.common.cipher.impl.CipherParameters;

public class AsymmetricKeyParameter
implements CipherParameters
{
boolean privateKey;

public AsymmetricKeyParameter(
    boolean privateKey)
{
    this.privateKey = privateKey;
}

public boolean isPrivate()
{
    return privateKey;
}
}
