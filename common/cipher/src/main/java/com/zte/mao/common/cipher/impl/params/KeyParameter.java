package com.zte.mao.common.cipher.impl.params;

import com.zte.mao.common.cipher.impl.CipherParameters;

public class KeyParameter
    implements CipherParameters
{
    private byte[]  key;

    public KeyParameter(
        byte[]  key)
    {
        this(key, 0, key.length);
    }

    public KeyParameter(
        byte[]  key,
        int     keyOff,
        int     keyLen)
    {
        this.key = new byte[keyLen];

        System.arraycopy(key, keyOff, this.key, 0, keyLen);
    }

    public byte[] getKey()
    {
        return key;
    }
    
    public void zeroization(){
    	for (int i=0; key!=null && i<key.length; i++){
    		key[i] = 0;
    	}
    }
    
}
