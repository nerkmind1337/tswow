import { Run } from '../src/compiler';
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('Lang tests', () => {
    /*
    it('01 arguments', () => expect(new Run().test(['lang-test0/01arguments.ts'])).to.equals('testDefaultArgs\r\n'));
    it('02 numbers', () => expect(new Run().test(['lang-test0/02numbers.ts'])).to.equals('TN\r\nZZ12\r\nnums#0\r\nnums#1\r\nnums#3\r\nnums#4\r\nFB\r\nFIB987\r\nnums#5\r\nv:0\r\nv: 0\r\nv:0\r\nv:null\r\nv:false\r\n'));
    it('05 strings', () => expect(new Run().test(['lang-test0/05strings.ts'])).to.equals('testStrings\r\nts0x\r\nts0y\r\nts0\r\nts0\r\nY\r\n0\r\nY\r\n01\r\nY\r\n012\r\nY\r\n0123\r\nY\r\n01234\r\nY\r\n012345\r\nY\r\n0123456\r\nY\r\n01234567\r\nY\r\n012345678\r\nY\r\n0123456789\r\nX\r\nX\r\nX\r\nX\r\nX\r\nX\r\nX\r\nX\r\nX\r\nX\r\nX\r\n109876543210\r\nlive4OK\r\nXtrue\r\ntestStrings DONE\r\n'));
    it('06 numbercollections', () => expect(new Run().test(['lang-test0/06numbercollections.ts'])).to.equals('test num coll\r\n#1\r\n#2\r\n#2\r\n#2\r\n#2\r\nloop\r\nloop done\r\n'));
    it('07 stringcollections', () => expect(new Run().test(['lang-test0/07stringcollections.ts'])).to.equals(''));
    it('08 stringopertations', () => expect(new Run().test(['lang-test0/08stringopertations.ts'])).to.equals(''));
    it('09 postprefix', () => expect(new Run().test(['lang-test0/09postprefix.ts'])).to.equals('postPref\r\n'));
    */
    // to fix you need to have "auto getarr = [&]() mutable -> auto&" or array should pass the pointer to array
    it.skip('10 arrayincrement', () => expect(new Run().test(['lang-test0/10arrayincrement.ts'])).to.equals(''));
    it('11 equalsoperator', () => expect(new Run().test(['lang-test0/11equalsoperator.ts'])).to.equals(''));
    /*
    it('12 referencecollection', () => expect(new Run().test(['lang-test0/12referencecollection.ts'])).to.equals(''));
    it('13 actions', () => expect(new Run().test(['lang-test0/13actions.ts'])).to.equals(''));
    it('14 lazyoperations', () => expect(new Run().test(['lang-test0/14lazyoperations.ts'])).to.equals(''));
    it('15 references', () => expect(new Run().test(['lang-test0/15references.ts'])).to.equals(''));
    it('17 classes', () => expect(new Run().test(['lang-test0/17classes.ts'])).to.equals(''));
    it('18 enums', () => expect(new Run().test(['lang-test0/18enums.ts'])).to.equals(''));
    it('19 forof', () => expect(new Run().test(['lang-test0/19forof.ts'])).to.equals(''));
    it('20 maps', () => expect(new Run().test(['lang-test0/20maps.ts'])).to.equals(''));
    it('22 lambdas', () => expect(new Run().test(['lang-test0/22lambdas.ts'])).to.equals(''));
    it('23 generics', () => expect(new Run().test(['lang-test0/23generics.ts'])).to.equals(''));
    it('241 arrayforeach', () => expect(new Run().test(['lang-test0/241arrayforeach.ts'])).to.equals(''));
    it('242 arrayjoin', () => expect(new Run().test(['lang-test0/242arrayjoin.ts'])).to.equals(''));
    it('243 arrayevery', () => expect(new Run().test(['lang-test0/243arrayevery.ts'])).to.equals(''));
    it('244 arraysome', () => expect(new Run().test(['lang-test0/244arraysome.ts'])).to.equals(''));
    it('24 arraymap', () => expect(new Run().test(['lang-test0/24arraymap.ts'])).to.equals(''));
    it('25 lamdacapture', () => expect(new Run().test(['lang-test0/25lamdacapture.ts'])).to.equals(''));
    it('26 staticclasses', () => expect(new Run().test(['lang-test0/26staticclasses.ts'])).to.equals(''));
    it('27 accessors', () => expect(new Run().test(['lang-test0/27accessors.ts'])).to.equals(''));
    it('28 boolcasts', () => expect(new Run().test(['lang-test0/28boolcasts.ts'])).to.equals(''));
    it('29 lazyreferences', () => expect(new Run().test(['lang-test0/29lazyreferences.ts'])).to.equals(''));
    it('30 null', () => expect(new Run().test(['lang-test0/30null.ts'])).to.equals(''));
    it('32 complexcalls', () => expect(new Run().test(['lang-test0/32complexcalls.ts'])).to.equals(''));
    it('33 inheritance', () => expect(new Run().test(['lang-test0/33inheritance.ts'])).to.equals(''));
    it('34 switch', () => expect(new Run().test(['lang-test0/34switch.ts'])).to.equals(''));
    it('35 lambdaparameters', () => expect(new Run().test(['lang-test0/35lambdaparameters.ts'])).to.equals(''));
    it('36 interfaces', () => expect(new Run().test(['lang-test0/36interfaces.ts'])).to.equals(''));
    it('37 objectliterals', () => expect(new Run().test(['lang-test0/37objectliterals.ts'])).to.equals(''));
    it('38 bitsize', () => expect(new Run().test(['lang-test0/38bitsize.ts'])).to.equals(''));
    it('39 objectdestructuring', () => expect(new Run().test(['lang-test0/39objectdestructuring.ts'])).to.equals(''));
    it('40 generics', () => expect(new Run().test(['lang-test0/40generics.ts'])).to.equals(''));
    it('41 anonymoustypes', () => expect(new Run().test(['lang-test0/41anonymoustypes.ts'])).to.equals(''));
    it('42 lambdaproperties', () => expect(new Run().test(['lang-test0/42lambdaproperties.ts'])).to.equals(''));
    it('43 nestednamespace', () => expect(new Run().test(['lang-test0/43nestednamespace.ts'])).to.equals(''));
    it('44 toplevelcode', () => expect(new Run().test(['lang-test0/44toplevelcode.ts'])).to.equals(''));
    it('45 enumtostring', () => expect(new Run().test(['lang-test0/45enumtostring.ts'])).to.equals(''));
    it('46 dynamicmaps', () => expect(new Run().test(['lang-test0/46dynamicmaps.ts'])).to.equals(''));
    it('47 json', () => expect(new Run().test(['lang-test0/47json.ts'])).to.equals(''));
    it('48 instanceof', () => expect(new Run().test(['lang-test0/48instanceof.ts'])).to.equals(''));
    it('49 unicode', () => expect(new Run().test(['lang-test0/49unicode.ts'])).to.equals(''));
    it('50 indexedtypes', () => expect(new Run().test(['lang-test0/50indexedtypes.ts'])).to.equals(''));
    it('51 exceptions', () => expect(new Run().test(['lang-test0/51exceptions.ts'])).to.equals(''));
    it('99 final', () => expect(new Run().test(['lang-test0/99final.ts'])).to.equals(''));
    */
});
