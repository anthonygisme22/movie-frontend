PGDMP  )    9    	            }           moviedb    17.4    17.4 )    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16387    moviedb    DATABASE     m   CREATE DATABASE moviedb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';
    DROP DATABASE moviedb;
                     postgres    false            �            1259    16445 	   favorites    TABLE     �   CREATE TABLE public.favorites (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "movieId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public.favorites;
       public         heap r       postgres    false            �            1259    16444    favorites_id_seq    SEQUENCE     �   CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.favorites_id_seq;
       public               postgres    false    222            �           0    0    favorites_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;
          public               postgres    false    221            �            1259    16398    movies    TABLE     �   CREATE TABLE public.movies (
    id integer NOT NULL,
    title text NOT NULL,
    year integer,
    rating real,
    bakedscale text
);
    DROP TABLE public.movies;
       public         heap r       postgres    false            �            1259    16397    movies_id_seq    SEQUENCE     �   CREATE SEQUENCE public.movies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.movies_id_seq;
       public               postgres    false    218            �           0    0    movies_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.movies_id_seq OWNED BY public.movies.id;
          public               postgres    false    217            �            1259    16459    reviews    TABLE       CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer NOT NULL,
    movie_id integer NOT NULL,
    rating double precision NOT NULL,
    comment text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
    DROP TABLE public.reviews;
       public         heap r       postgres    false            �            1259    16458    reviews_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.reviews_id_seq;
       public               postgres    false    226            �           0    0    reviews_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;
          public               postgres    false    225            �            1259    16432    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    16431    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    220            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    219            �            1259    16452 	   watchlist    TABLE     x   CREATE TABLE public.watchlist (
    id integer NOT NULL,
    user_id integer NOT NULL,
    movie_id integer NOT NULL
);
    DROP TABLE public.watchlist;
       public         heap r       postgres    false            �            1259    16451    watchlist_id_seq    SEQUENCE     �   CREATE SEQUENCE public.watchlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.watchlist_id_seq;
       public               postgres    false    224            �           0    0    watchlist_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.watchlist_id_seq OWNED BY public.watchlist.id;
          public               postgres    false    223            7           2604    16448    favorites id    DEFAULT     l   ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);
 ;   ALTER TABLE public.favorites ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    222    222            5           2604    16401 	   movies id    DEFAULT     f   ALTER TABLE ONLY public.movies ALTER COLUMN id SET DEFAULT nextval('public.movies_id_seq'::regclass);
 8   ALTER TABLE public.movies ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    217    218    218            9           2604    16462 
   reviews id    DEFAULT     h   ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);
 9   ALTER TABLE public.reviews ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    225    226            6           2604    16435    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220            8           2604    16455    watchlist id    DEFAULT     l   ALTER TABLE ONLY public.watchlist ALTER COLUMN id SET DEFAULT nextval('public.watchlist_id_seq'::regclass);
 ;   ALTER TABLE public.watchlist ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    223    224    224            �          0    16445 	   favorites 
   TABLE DATA           V   COPY public.favorites (id, "userId", "movieId", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    222   �+       �          0    16398    movies 
   TABLE DATA           E   COPY public.movies (id, title, year, rating, bakedscale) FROM stdin;
    public               postgres    false    218   `,       �          0    16459    reviews 
   TABLE DATA           a   COPY public.reviews (id, user_id, movie_id, rating, comment, created_at, updated_at) FROM stdin;
    public               postgres    false    226   ?l       �          0    16432    users 
   TABLE DATA           >   COPY public.users (id, username, email, password) FROM stdin;
    public               postgres    false    220   �l       �          0    16452 	   watchlist 
   TABLE DATA           :   COPY public.watchlist (id, user_id, movie_id) FROM stdin;
    public               postgres    false    224   �l       �           0    0    favorites_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.favorites_id_seq', 5, true);
          public               postgres    false    221            �           0    0    movies_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.movies_id_seq', 1060, true);
          public               postgres    false    217            �           0    0    reviews_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.reviews_id_seq', 2, true);
          public               postgres    false    225            �           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 1, true);
          public               postgres    false    219            �           0    0    watchlist_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.watchlist_id_seq', 1, true);
          public               postgres    false    223            C           2606    16450    favorites favorites_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.favorites DROP CONSTRAINT favorites_pkey;
       public                 postgres    false    222            ;           2606    16405    movies movies_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.movies DROP CONSTRAINT movies_pkey;
       public                 postgres    false    218            G           2606    16466    reviews reviews_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.reviews DROP CONSTRAINT reviews_pkey;
       public                 postgres    false    226            =           2606    16443    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    220            ?           2606    16439    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    220            A           2606    16441    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public                 postgres    false    220            E           2606    16457    watchlist watchlist_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.watchlist DROP CONSTRAINT watchlist_pkey;
       public                 postgres    false    224            �   o   x�}���0ߦ�4`��%����q<y�V�&M��A�bY���0�5�� ´�w�$�����+"������2صD�6 �?p	��������9RX`yAt3=�l:.      �      x��}�r�H��3�+жfݳf%Z���wQ%JlQ�����("�l\De=�o���~���|��	� ���c�V�R����9~	���.���GٕOU������$�I�����y��b[]���	�C�T���}[]����0=��H~
��mQwE�^4�s�*��+�=�N�$r.��*ڿu�ź)��/x��=ov��ܴ������%V��w�{V�OE�*Z�|�,��uQ,��_�[��KB*���k���0:	�{�R�zyk�j�v��'�gd·�C�~ɟ�J����aj��N#�u?6?
����+&}eN�Psr��s�4��+/K3�F��?���Ċ�x>����s�@��7~/p>oy]�x�Z�������s^5ͪ�6m���f锾���;�]�\�u�c���S��b�V�/n��>�y_��mG��e�d��Ĺn�e����~hei��I<ζ�:�^E�e�Z���Ò�e�b=4-X���S�_��u]����2߉�q��|�aaw,˕룧�9�Ƨw�k��\�b�C'�s��?�=J��˯�s�.�r��R'�N���k������?��ٴ��X�F�R��x��d���5�ʕ�\5�@�j�>unh�����1��������s�6���yq/��C8id��8��:�k���y*B����Æy��y��~)V�fۗԒ�������X�V�4mޭ����GN��g���v���,HtO�����8�A��{(����Rc�&�s�p�	��v(�/�&��<�u�f�t=�#W:H�s��r�Rt,!���A�<�?�$+�q��r51)&f��!-N ��f�NW�Kz�.��$��В<��i��:\4�$j��E��9#�G�U�Z�����m^�I.�m�w|&��X�0t����nO��Lҩ�ݫ�ۖ��r�$�^i��T��@�� �L4F;˗u߹����;^�dWH���mGۡ�Nݫm�5+R^�;������f��u�˘A�cO�����i<~������������B���f������Bw�P�k��Iht-����!���7Z�-F�$N��:P�����2W�m��������Y8Yf�Αo�?��s���C�*����2�6��vC{�ޏ�߹[$q-+
�V�JZ����q�"Ҍ]��[���iGMH���A����}��-~&��Fƞ� &_�a�*�#��5��H���g4hт�]bۈV{X���6�|���恍���b}��Hb9����M�ik��\V,*R��t� ����K�ܻ_�Q��Ό�ڐhr�mSt��C�v���y߼���i˚~y��x)6�g�p��,W����7,*c6Jd �s�,_��ԓ1	Z�����-�k�"}�:���}����Z`��4�z����.�}N��%0�~ϗ�("��2�W��+ۜfR-�㔸�gH褱�o߹���L$;p���>4��ƽ�%�C��B�Z��<��GFo�썣yc�2lw�|�M<o��CC��N�Z������Z��ش+-�������&�!�_n��@���e�!�t�k�&�/6�~�����˱�d@�m�R�0E[�&Q\mX��L
���^�S�7�F	2�V4,����n�k�'#,[1�Vj���'-����7w�CՅ�bF�s�(4.�k��.㸔�O욇�(}&ْ�R��)B �i��a�11$:�JX���Ђ<y*;���J�掌�0����#̉�5�y9	�q<3�w9���,��:�d/�u�$��C_Ӊ΀�V$BΨ�s^�J�#;���<�DisTM���P�ъܲ����{�+?����$sK.��/Ŧ�ПU��e��"��&zFJ��NH*O�3b��!���u�A�T,cIi*�(��H�VK��4����<�bَ��h,��n^M�/�g��z�yY���}�'9�m'�[�򻤍Lj�$Kw�L�\���z�㫎FxYl�Z�k�[�������h��� 6 �f��uǖ@f�4F�"��q[b�$$��M��[�#ӳ���E��9���׶;��ZR
v�H��mg� 9t�o�=��7L���d�1"�0��v�M#m��d�d t�o�$�D^�CzsM(b�h��C�*ͣ�����]&r����!�d !%"ժ<2&.�-Y�{�)�r����S �H�溋#B��x�13]>t���ɦ�.��#��S\D��.���}��2����C��'=�uO���T�R�'<&�<�wn��%I-kn�*���&�ө�9 Θ�[��cyg�V[��Q��dcP;��:��a�
����&�����o�d
�.ˁ���g�z~r�ÿ7Չ�3Rt鑉#��%�ŷ�����f	&�e�g2Y�/;�y���Q,�&�t��La�QJ,-=c9H|�,%�CsƏdVS��q1��z̻-?��Р����QTBe��ư���@�5�D�i��U�n	�c~���N
{ALHl[���#34="J�dl����$;�65��2��#��o3��Χ���	����YZ3/47zHK��<�Tَ����4#�cC=��s@�\��-~(�J����^�Fu�4O�"�HOXY�0ԍϋ���$\h?�a4M�����bgw����Q���hݐ=Z�s���u`e�0����8�}H0ij���ߊ�J�H/����_~Jo|S|�����F��܀ӻZ�P��S,�>������}�vC܋|��Kjd������Y�`�r�d7��S���L�kȥ�t��[]�ܡ��o����{�w����v��X`B9�e�>�EL��)K���\�i�E��6�w�� ���+(�X�/y�d��.:	}j�?5&�i�4O�H����I.BC�-�sSL����#�?�<8̱���Lr+s↔���0p�cO`�����m�N��U.��BƹZ��y_�ˡbb���}"c>�w�v[�&����HD��/fGoڇ<h=)ف�aw#'�d������q�p�5?J٪��1�ы�p�WX��;(O=�#���k�PP�I�����0R|����������O��D�~��m�{w�4�d�O�8��6�J=�9s�[]�v���h�?�йiV�U��?:��Fq \�����k[n��)s�.v�+e��vI�����	�yI��Wy�0�1bϤu?5O�j'�69��z�P�wB�����Y�EZYp?
�2��؃'��	��h�v�4�aj�e_�ܳ�v��[:ڏ놌2]V�/�ͫDܼ���d��/[���}I�|z*rٔCۍ� 1􊼭�}��Xu|�I��d&��ڳ��Y�3Z��=���?��U-�Od��=�+ڏ�������E�J��KӏD����4&�Ξ+������;`�ox�0T� �Tt� ���B�F��ؔ��ۆ�cl���,p���oz�+m/߯˪��Z���o{���wk?�\��_�?
Ȫ�{=�dD����q�G�M2�ƪ^x��k�đ
���鉽���������V� :�V��$�����+|�m����;.�1���~����;�������4�~��U9�̬�2�D[z ���ֳ--mz���a����Rܷ�h<Y��v��ő�f��^�ʘ���פ�rUd�ӿ��|�=[���.U�@����%��s�i�^m�a�Ѫ��rC&a��#;��\�����a�n���Eb�=jg.G���~-� ��L��H�t�{P!B�s�K���3�#��,��:��;��W�����{`֪�ȇ+�s���^��n�O��ޓV�~x�2tk��Ll�Ope��gi��6a�q75ēXHi���{��Z�f�(�~��i-ڱ7*�u�-Kˀmx?6W���(���}(M��~[�p����k��!k����(�Vtv����<k7;-��SGw���db���&/�uۼ���f�����B��C�)/�1B��Y!�|��d�`�||?6��u������D��uL"����sٞh�B��.��o��ښDh���l�vȃ�8e�� 'G�d�jd�@����\�S�%�'���G8���W��ʌ�    Gz�Zl��:�d�od;��sxG:P�6R�����t���A��U���v��~zx��-�wժ���H����ħ��W��`)O�*?������/��E�|3�,����2��B����/���C&s$�}[�����-�X�E��Hl~)�d	����K��STwW6��}�:�n1kr�usM����(3�o��=��#y�i�l�Y�����p�W?i��Qzƫ���F]4�`$���B�pPU<�!�⇑����&
-���/��n�>�/���+�o��
�0�=z���mW�=�vQ&\�ޣ�m�����&�:YFj�m�d��~|��;V�����'k����Ȇ4�M˱)	p��V�<�]�bZ�RSl����#_"aD;�E ��d3nϏkS��X4;:�W�K����؟���j6$ZI�2�O�7�5Q���HX���k��7���?�i�%1�@�b��(;X0�l(�(�譄��VY���Z-dKR�W�=gG�_�#?�^�����K���7(�^M7����ĞsC ���kX�dv��ul�M�W�@���~���\5o"X-Z���8�G	+�;�K��-_J�aBq(�w�l
ų,��Y�8�{��?�~D���V?�.��zjr!�N0?&@7T�LX��~@�feO%h�c�/���#���p��y�ڽ��cJ��;/�ՒN[��-��r�s�앹����
�q���|���i>>VJ>pywL��V��O����	���7�
F+�������6u� �8WЈ>W�l�X!C�'��ww��v�����	���V��	&�&wjh%p��Z�<�n�_"�e��@"�,!��ly���A�׈��	��q��vhJ�����|?6�
	L���0;��1#|Q�����D')�?�;��9�
����Ûq�s��D]i�z �m�����F�D���dMj��S%֩M��/�:��2#H�qNM�m}R9�W[D��)���S?[�W�m�e^�D�Ǡ�m�=���|�yVIHGWE����aE�5�+�v�t��8|��)���M�w��yD�8:��*f���nY0Il7��~�(�k:�*��#i�F��!�͵��/4��H��╕Of�ZX��{߀L����,~nIbN�@��.vl�$vS.Xx��&�J	e�l��E<�։$����<Wqv�\F �a6[h��v�}��(�;8-˕��j���r^�Y]c�(%I���frNȔ���خ�M���8�q|�E��EE�B>Gז�o��׽��T�,*л͎	臻��e�##B, �& ��b]N@k�Κ�O�z�����=��@�(����1��Pg> �E��Ͱ�JF���z��m�P��Sf{����!�4�x:�4�Q#{�y`��TU�vBL�m��a$�q.�!�+N�ȥ�(-�_y�����^*d�|h��yMǏ� ����{��td9��T�-c��ĦµH�ǝ��5��� �����V�ż�zuj���?��5t��e��h��	���H���-�8������b�.T��X-��ɬ��V��������V��v6N��͚��P��	��`��goP�O�`Ь#"2_��D���	�5�\�iw�A�|�7O���٠��-�����E�{���� 5�"��	qG�DU�ޔY��e]Φ#q>5�$��5?tEh$�)��^���'�f2��v2���DK��/2��i�E�����!U�Xk�h��z�u`�E�o"b�|��Z�&����54����'���+�i���l)�1����!��h��lA�v�so�j��-��}$L��X�	ș-ހ�y��\d-�KR�k憁`b�D�s9 � �i����q��[�ϩ�e��#8���*
d��N<��m��F����{@��ԕ�~d�	eAO���y8�+�ەu��D���A�:�E�>4�Y��?�Z\H�z�=�̯���ӉBD�7���_<�ǯ妐�G�G���GhzM�a�DF�i`������򽀅���׆`�"fձL��7cj��Jf��Ed�&�� "s	��$<���H��m^����sJ-��<�S*���7g";�% �m6�h���x��A L�L<���[S=��Ǧ^�X��)�xD;~s����$�}��r��\�C>�����M%�?���S��U�۪Tn���]���i�hc\�#QBR@�q�̏����{�i~/� )qB�6ٗ#���t� Lm3�-�,�#��<�w��f�iw�H8s��_CP)�̂��SӮG�E�O?E������[*�§܈��6������X�u7s�%f�`>�4���ݶ��3O�NÃQa	�n�-�8#�P�i���\�j�cU���kc�Pc�7�Z���*���`�ʯE�O�2��"ɳ��N��6{���n�Y����W�����jLy�|�J��FCC7��Ƴ�(���Ο�� ��\��7� �wl�~�����L���Y8�}^mh�[���ᖸS�>���H����)QH�^)���Y���,a2RIH�j�j��of!Y�`E?5�i���?��Umr:�Ŝ)0,�:�9�Ŗ�a��Z)�����PSeY����9$�\��~)�k��S����CB򪦊�ڳL�p���)�ؿ�� ��p��p~B!�Ж�.�=u�K��цzt,��:��	��c���2�6$��A�."�D��1;��.2�(��j�1G�f���l�~��~�6OE���Z!AFO�E(�������f���Wy���lv$*2��YF�!(�!�����qD�7��)ױdN�@Q�?%��.��������P�G�Jb�N�����r��,<:E�A{�������aÀI.��6�K}��	ib0E��<0�{�`8է�n|{�QHh�r'w9JJR���7�%:����PC2!�}�����?��'�Ѽ�߶�A2�;buܻ�:����zEB���Go�
x�l�����]�X��y=FX�����������J���/��N�$v�]5)���s<�H����1c�ߐl�Y'�4�r�H�p�&���zU/Q/D4@0�Qw&�Y��.�����m��?��7>��t�����ں���(����ё�=�_�[M���u�<L �'"�I��SR�c��ҩF���\�V��������2Ģ�@��t1~T'��2���/�������_����ϟ�F����ɪ��L��c@~6)ҐlW��-tV�7ע�jI�7K� 7i=�hʱ��t��ШvJa��MǙ1��y_TՓ
|!��,&�$��	���b�Xo'�A���H��F�dH�V��5��O��5��%���J��X�'�rXI�&�b���?��qYv[�ǁGF��.$K�h�p&[�2�m����A4�P?Z<��yf�^&O̽K�ѧ��Յ����%���%`q��?�����gNfH�T�y'^1C�r����LW�}��vAG3���8�*0�kL����)�
w����1i1X��h��ʇqਵߐ��Y�
퇟�X��k����)/�D���Q�w����#�5K5�1�fNP���"��ŖS^�*�(��ܴ/$c�.1���C&��Λ��5�Y�d���p�GQ�`ۿ�c�Yh`�5g�ʅh��A+���g�JS�C�j�%�t�=CR�9�l��>��2�/2͵$�xZ�Gx��z�r���XG�q8r��w�@��Kِ��� �caxJÄ4F�
�+�q*��8�,a�9ǴG�H�Q���k�a�R����������>,�������	���-�y��2ӈ��	����MR���u�k����7�X�	����nW-u"[j&���zO"�TȠ��>��Yg!� ������ܲ�
@��TZ냄�+7��mb�#3�o6ORc�v�����֥�Cbd@�C�,<�iyct$c#��t�U�a�׹��(�b��s����Rq`�e0�a�g�l�o�{���힡��X�J���    �	ы��s��KJ�*J��#��n��P�i�,2돑��ږˉ.�+�F�/����{_����?1�BU�!��P�",�(i��t`�[�7��n���#�n7R�DU7����+����T�W��f����k�������X����?X��MF�}��*�S�<�*�vմZN��M"����> nE��f#�lZ���P�,b?����������k�1�ql�BD?�W*jp����@���UU
�5�p�I�Z����'ɉ�"RD��w�#�6K�^pd��c�kJ"����(�%1R�O%���j�$'������	�T���d�_�+��{��#�#8��a�?��		Pd�P���ϗgB�L�j#_U<$i|���Q1L;cf	��Un�n�z`AV2wfj6� -&>(Bb��Ɯo�%�ٵ�*���رl+�H��k���*���=:/",����dVdY�>��/#k����=��{h�}��Q9.���]U��kvT�Fe�(����E2�Aq.�xCS���.}Ӯ��J�h�u��f22@�.�N���A��N�1��H �{�hNF�Or�]��6�n9��Y�Z��(��������5�[>4��v�M��'��n���^���� 8�.#���=�\9���?�\��i82���F�#%�"��j:��nʞ@��olZj&�������FJq�5Q�(SG!׼��r�G�fk������]Fɥ}a4u3���e�~�g�H��ɟ��ش#�51�_�S·�e�W��3k����2W1Ce�vʪ�O3,�?�%(�a�vQD f k�*�#T�����fK8�d�
�bu�#������@�m'ܷ?uˆI����߹RBvTC���}�(:�$g�~2������#�a�5R�F̊���|�K�7x���^DQ����i����tYa���uI
�*�x��U�x����iV���P)SI�H�ÎN�x�D��JP2�:�z�Q8WՏR�S2SpqU���%�I4s��t�"�ާr��ĸ6����$q���\Z3�e�tg$�V.E'��(&t��4H�萑h�!��鸉�$��>WcL�SK�ul�*�M�J��T�5<���|�V4-k�F}hsyD��}'k,��Ց���C^VkL���B��쉒H��.T��ل�\��4&�Z�H �2u�����]�;�Q�j;\��b/%٬!�?Be���"�f�S�8��S�QY7�������e�c�b،fZ����	Ԯ;o�@���
Oy�]��IU1<��3&Go�y�@54�IQ	^�wڻ��
��E���P�4��bΰA��_Q���{�Z�/������aIm�O���ኢl<���)�2˸̪�%���d�7Jl�����t�>�P�ّU��J�H�����g�~���M�F� i������Pu���H�Ų�Τ��Ѕ�8h��v����E�G�]�K�D�)W��̹��\��F��8f�S�2���}Y�'�!b� l�I�גu���D���gܤ6k��|R���#o֔�"��-$��f�b���C;�ʓ��g(��<>9&`6�h��1�ʌQWR�L�����G�T������������cZ�ǼR>���F�$S
Ƌ�=�+�P�K��	rb��l��Jݡ���(�p��Q����^�����	����Ǡ�Æ�Je�p',3W�A��b�2�E~ ՚K��B=Ԉ^H3VT����P㜃�o���+{>����g���	�8���5}~8�F�d�-`MH9�g$�U���x���P�a(A%�p���@9ǈ�����I�5L�
�m�g�}U�R<I���B�����h��,t�7iA�i!��c;�`��B�O�3��;;��/�X?J��yQ��*�^1cLN.&(�]���ĉ	f^���U��h���n�m���qXE�1��њ:G�"��N�Ũ�
�]�l�c��
�c���x�P3�����)I��5��
yY��1̫������´��	g�M�i���L7!�l���/�#�7#��o�����	f�� �U�;"F��/�;w���d�sL������s�T$����ejl�P⃋z�h�����[Q�
��"y�;&l}���T�ȼp�������2,��w+�R)`�l��<��S�4��'b�I求�ͫ��M�@L@�VI*�|�М�Hr[����J����2$3�#��KKz��C�ñE ��v ��3mZ���>+�wʺ�$0ĳ�Չ	�^��t1�Ď	Ўʄ-S\D��h��T�m]�$ml���ڙ��Gav	�3���dґ-p
mGs���E��b�`q�J��ϳe�*T�7W�XU1g�w4ϵ�g�����5Q=�^P����&�928�!�XV�\��M�u������u�T���$���B�#�;`l\XL�w���A��^'ƨ=8.2�"#�8�����E(����}k�BX/VF��u�	;ĭ�Qc��������g+8d�������$GF0lLV�I�]��~u՟��+�	��>K"��n���J�ʅ�o�$��אW������Y�������ͬ��:G��Dw-�`?"���om".Tyԃ=� �'�%�"2��3s*
ӛ��rw	����f�~�4����\P���`�p�#�$&����@����qFY�Ù$�|�S.��u�f*lP-iY��'Z�_̟Ƕ+*b:���r�5׬�L1�e>:-��g��|����T#ԺȚ/o6�ҤDy��!��c�)2U��Z�6�~���'���Sӷ(����?+����}Ǻn�� po�G��.}�����[�-���tu�SU^�2�r�B�'�Z�qX�������e�[&0��b��Q����ճ����o��� ˴d���N�脾�n��T�#�=dRX����A��9r�B�qOQ<}^�@�������-	���M�;�������gW�%�e�qC����s_& ؇� ��2�^O$p��$
΂?��ߙc(�hy��f6D�T���>�S��;����ɼy�k�p¿�vI��Y)�OLc�r����_8R_�Ь:��՚('��І��!�����N���btH3���U:ԡ#5�m��Q�k31}먿��*_i?�6�����i��^?�$-�]lt	O�lu:���TRA�o�K�ԛ��z�g��,��(�&p���Z��ֲ
�D�?/M_J�g$X/��$X�߀
���_4�<%�Vqy�eh�����&3�=��I$�-z����)Z	"�B����XC�@�f����M��wb�ܪB�}�MZ+�Q�`b~����L�K�E�U"��������=�޻��!^��<�͗˚R��^'(~��Es�:gZ�,�^e���ý��w�*{5��3���߹�vH��x$�-o�������O�[:�k�g��_� �PtB��C�'	"'ZH�%jV�aV[M��튊�#���)�ש�wG��/�n8��o�M��.qM��uw��6* 	R{9��cF'&���
�� �2+؅.�	�
*,߬~"��"�����P�H� ywH�w��l_��a:��K4w 	�С������!HU���Y
O'!�o��_�3�L,1�#��M,������F�=�J�0�B**^�&�n����f����q�̃$+�h��;�>�Y�.�����;�{�PȌP����r���83��Dެӳe�E�t�#hi쓌����k�N�D���@#/��cِuI��7�.$ s$�)�B����	�F��ѻ��*�r�!	�s���`O���<	0_��8�|���H������c7�$Q�	b1J	:�M�EeF&w4Ќ��5���Qd��I�J�[*#j�2�'Ԍ�Kb{��;.���X�6*��Ltb�Q ����;��yfWBX�3ლ�Ϧ'��h%d�~����r#2Y�$�<�7��`�ĒQ��._$��Γ8uΆD��p4k�؊���~bR���;i����溂'������8,���s�� �  R�D�"D�#ZX�F	�Ҽ�5�>R�.ITQ]Q�:�5I�|��7�h�H1��0��ؙ�Q���$&�'s^��W�+���Dć�CO�[�.�bS�4����b=H(�Gu�Z����7I��R5dKP']O�].KLg�S����Z��4� ʃ�I�I�H���4��ڴ<bɜ�ĶY6g��~X1H��)`�y'tBc@b�MѴ/�:|!q��̓��L���S�W<QGБ�V�"ITKA�VU�2�;V� n���Ĉ�Lp�Lť�q9Mf��-$���xv�3O~�ڪ��x�^:�NV7�t+�\ߋZ�ӃYDa"���!I����&Y7\����S�{���y�q����+��o�yZ�ң͓�e@������w;��C�1�u�����H@1��+W`o���:�I����MY!���iL�z�lJ�,�L�r��7}�H���5&ݐ.<�n�� ��Fn$c�c��/E�\�J|�L���}4����6��x��3�ֽ.�JW�CE���J�+|��Y�Ɣ�a�]��V@�H�������/@</����3������>�Y@��H2�d�O=�/�߇V<I�䛦���/�X"�PKOOrx��ϒə����fm����;��W�xً٥ޘ��-�=R�HX�F�TǛ5Ҍ�b��l8:���B}}�x��r�;��v��䊱�S��Uѫ��T*:� ㊚�]վΑ
�GJ���0u��ىSRh�=ё��f����J�w���~0�S�D,�~�҆��v�q�8x��#)s���Ndd�����	n/��҆ƽ�eN���tL��*m��'��2��Ȍ(� >�/��R����#��ܳ=5��ۛ�9YFt���>Y����;��&�:(i ڙc��渗i
ELq�&{t������J��c�G�7���k�d��4�9���q�i0�)j̼�e��z6C��HJ�@"`��V����3Q,�������k)|�(��m���H̍��W���������\�8UE��Tƛ�SC ��&�]�t�1�c�	�,�����)x`ܶM��c�1��WԼ�$��_K% ��U�Rx�l�q�b��}�:>�p��U�4��x�����90��"o����g4�F T�,
Z�̓�E���#�-$j�d�*�~Rr��S)u �M{�"Hm�V�4,E����r8��m�ąȪ<_�p��7��=3����T�D_!i���9u��[�8j12COR��gu��O-f����[W�����OQ����.7�����^ʊ�C�c�Z��fHYJ��#��
��Z�R�f��䂃�#6����̦f���(q�m>��PW��#� o]�Ct����\�� 6��@��r�Z6%���z?Lv�s3Ý~��u-gL7Io�蔯ݫ{�i��A����ޝub�v�\JGH7�CC�}q�#�g� ��r�Ў�n�/���Lb��������2*T�m{d�\��*���`(��ꚅN�&j$w3��L	@ߓ4|.��Z7Ba�����S�>�J��̓z����|������MR'���|��������4*����]�)����|��Ω4b"��y�d8~jr�:}�5����[D�3,��)����i�S����i�rb�Z����d�3�$�U?��\����Fǝy��6��>���`L,��X�����
g�eX�Y�9%=��LA�2;�ΐ/��"Du�C�-�W��lW*O��R��ڗ]%#:r�rJC`����o^w�:+ќf��&��xsN�4��R��g�*�|��;����2�ȷ'�?��~�K��T��E�?�	��us���:�%�x�����t��I��{�H�MC&�c�yk�Ld��E�`X��>n�0V�Wv��-Ta`$�=O��9�ѡ���+�3�d+{�� c�!�,���P��v����y+��{�y�
^D��SU[Υ�)�jU~�8D�����	6̔���B�㯡�ς���Qb*���M�F<��b���y�qm4��"�~�-Q3���cq@� l�.d� �k����p��W̪fI�/*�"k��t���̹]�����W�Y<#�<��[W�H"{�PF�y�@��#�E<��=��:/���}�Dz��=�YT�E�e�gU�=?�ekJ�?���O�-8x��%}u��E<g��p3ֱ��t��ж�����)aGMao�1�8CV�M��L�LF����/!O[I̵d��7�J1����7��#�&�e�=�@��F�ǂ���&s�C[P��j�<��7�$B�ܯo���|�Բ���W�0��ٯAU��G���4�zb�韵��Ĉjep�o����?<�d��˝�{>1JO쥓Q3w�ߡ���2Z��<u��Q,�,��ˁOĺ�Ew����ȨZ�Fd��]�*"z�+R�;�E��4���t.�|�B����WAF���6��\�Ѓ/�"�`�u���ou��'�or�	r3��#Ƚ��Y���@�D��P��=�?� �ٖ	�T�'��4�6�d��Fw��_�EW��~g%:3B�g/ (��F콅y�t��Z���S��4J?,_%��1�?:��e	��$=�����k��sW�d+�6�����u"��,�}��|P�Q���d1»����@㧖�J��e�̾VSʺ��5R����ru�����}��X���.����<�^�_��iR��ҫ��}�v�^�A$w,u�Yo����gl�2>��Ԉ;A]H�r*�!�JG��% ��H�k�5D��OvW�T�VUڜKl��� ��s1V�g���sd^�욗:�:�]=��SS�õ�B��R'�]]J��{���K%L���yc��Kz���%��N�~d=�=�c��Ak˚)�����N'a�]��i�ȅ0�EI�W_��+4��������?8\3�Z���~{vf�(�巗����U�>kg����?9Ŝ*�&������s�{��uu�DЩQE?/$�it�@�9Q�Æ��/�z�ר��<sm�Xˏb��C�s��#�3S����1B���V��(it?��H�0T�G�>�ыl##B�V*��Y�q��C�)��>©Y����������w:�>�V��I �.�w$|��7��ԝ**��f[�X��������r.���"�;~����U�e�K=�-Ok����������0���u����pRʗZ�{�q?�� �%{�l�7֛x[9�v7�� 29�_�R�z��Z��Zz�P� �ɷ��:t`�5v̐���=������o��4eW�*��u��4���=������y���ddL�v:+n,d4����4����ȩ�3h7�k(꥾��7��}	�l��:�A������xxP�Fܯ�n �`;x8h�Y��Sp$\Y{������������K�#h<:9���ql�k�{Dr�Ι�H�J�Z��?�
}RY�?+/�O";E�-3���1]"3Lҗ�4�w��c�M��1��7���?)M{iCjq������3����4u�Ń#--��u�ܞݮf��J��&��]zAM2n�EI
;��-2��y�Fs���K��7PPͧ�0�p6� ��uܦ&��%$v�>ˏ�7;���e��g�^bֽ�V)#Ԟ���7�|s�u�4�����`�9�]s�3��� #��N�Lg�π$��oj�^�e#9'+�m8��?[��gN<�5�s���Ӆ)<�����^�\k"�J�cGөS����6eU�����?m�L�g*
���9�"�:?�)���b��\��q�y�9#�=�N����"ڇ���{��'Ә�U���k$2�Ȼ"D�����m4��َ�<�8�U��*��m�jX�G��B��lE})���d�q<G�V�����f�X���4��B��(-A��??��o���l��)wRZPo7�	���7�Ɉ�k.��Ӆ��>o��c\�f�
���	�#�?ݘ���:��s�i��F��W�-��X�A�$��@7��:�31�����_~�XK�l      �   :   x�3�4�47��44�L��O�4202�50�5�P0��21�2��372�50�#����� *�/      �   e   x�3�L�/��,I-.142vH�H�-�I�K���T1JR14P��uu
1�stu/������u��L�J��2����*s5I�3
p��IN1�)�p����� `��      �      x�3�4�44261����� >&     